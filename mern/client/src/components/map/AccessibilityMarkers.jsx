import { Card, Box, Typography, CardContent, Tooltip, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { blue, orange, purple } from '@mui/material/colors';
import { alpha } from '@mui/material/styles';
import React, { useContext, useEffect, useState } from 'react';
import { Circle,AdvancedMarker, Control } from 'react-google-map-wrapper';
import { DataContext } from '../../providers/DataProvider';

const getButtonStyles = (selected, color) => ({
  color: selected ? 'white' : alpha(color[700], 0.7),
  backgroundColor: selected ? alpha(color[700], 0.7) : alpha(color[100], 0.7),
  boxShadow: selected ? '0 4px 8px rgba(0, 0, 0, 0.2)' : 'none',
  margin: '4px 0',
  padding: '6px 12px',
  minWidth: '120px',
  borderRadius: '8px',
  '&:hover': {
    backgroundColor: selected ? alpha(color[700], 0.7) : alpha(color[600], 0.2),
    boxShadow: selected ? '0 4px 8px rgba(0, 0, 0, 0.3)' : 'none',
  },
});

export default function AccessibilityMarkers() {
  const {pedestrianRamps, pedestrianSignals, seatingAreas} = useContext(DataContext);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState(['ramps', 'signals', 'seating']);

  useEffect(() => {
    if (pedestrianRamps) {
      console.log('Ramps: ', pedestrianRamps);
    }
  }, [pedestrianRamps]);

  useEffect(() => {
    if (pedestrianSignals) {
      console.log('Signals: ', pedestrianSignals);
    }
  }, [pedestrianSignals]);

  useEffect(() => {
    if (seatingAreas) {
      console.log('Seating: ', seatingAreas);
    }
  }, [seatingAreas]);

  const handleFeatureToggle = (event, newFeatures) => {
    setSelectedFeatures(newFeatures);
  };

  return (
    <div style={{ position: 'relative' }}>
      {selectedFeatures.includes('ramps') && pedestrianRamps.map(({ width, latitude, longitude }, i) => (
        <React.Fragment key={`${latitude}${longitude}-${i}`}>
          <Circle
            strokeColor={alpha(orange[600], 0.7)}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={alpha(orange[600], 0.35)}
            fillOpacity={0.35}
            center={{lat: latitude, lng: longitude}}
            radius={10}
            onMouseOver={() => setHoveredElement(`${latitude}${longitude}-${i}`)}
            onMouseOut={() => setHoveredElement(null)}
          />
          {hoveredElement === `${latitude}${longitude}-${i}` && (
            <AdvancedMarker lat={latitude}
              lng={longitude}>
              <div className='px-3 py-1 rounded bg-[#0af] text-sm text-white shadow-lg'
                style={{ whiteSpace: 'nowrap' }}>
                {width}&quot;
              </div>
            </AdvancedMarker>
          )}
        </React.Fragment>
      ))}
      {selectedFeatures.includes('signals') && pedestrianSignals.map(({ latitude, longitude }, i) => (
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor={alpha(blue[600], 0.7)}
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor={alpha(blue[600], 0.35)}
          fillOpacity={0.35}
          center={{ lat: latitude, lng: longitude }}
          radius={10}
        />
      ))}
      {selectedFeatures.includes('seating') && seatingAreas.map(({ latitude, longitude, seatType, category }, i) => (
        <React.Fragment key={`${latitude}${longitude}-${i}`}>
          <Circle
            strokeColor={alpha(purple[600], 0.7)}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={alpha(purple[600], 0.35)}
            fillOpacity={0.35}
            center={{ lat: latitude, lng: longitude }}
            radius={10}
            onMouseOver={() => setHoveredElement(`${latitude}${longitude}-${i}`)}
            onMouseOut={() => setHoveredElement(null)}
          />
          {hoveredElement === `${latitude}${longitude}-${i}` && (
            <AdvancedMarker lat={latitude}
              lng={longitude}>
              <Card style={{ minWidth: 200, backgroundColor: '#f5f5f5' }}>
                <CardContent>
                  <Typography variant='subtitle2'
                    style={{ fontWeight: 'bold', marginBottom: 8 }}>
                    Seating Area
                  </Typography>
                  <Typography variant='body2'>
                    Location Type: {category}
                  </Typography>
                  <Typography variant='body2'>
                    Seat Type: {seatType}
                  </Typography>
                </CardContent>
              </Card>
            </AdvancedMarker>
          )}
        </React.Fragment>
      ))}
      <Control position={google.maps.ControlPosition.LEFT_BOTTOM}>
        <Box sx={{ minWidth: 275, borderRadius: '8px', padding: '8px' }}>
          <Card variant='outlined'
            style={{ backgroundColor: '#fefefe', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)' }}>
            <CardContent>
              <Typography variant='h6'
                style={{ fontWeight: 'bold', marginBottom: 12 }}>Accessibility Key</Typography>
              <ToggleButtonGroup
                orientation="vertical"
                value={selectedFeatures}
                onChange={handleFeatureToggle}
                aria-label="accessibility features"
                fullWidth
              >
                <Tooltip title='Represents a bench or leaning bar'
                  placement='right'>
                  <ToggleButton
                    value="seating"
                    style={getButtonStyles(selectedFeatures.includes('seating'), purple)}
                    aria-label="seating areas"
                  >
                    Seating Areas
                  </ToggleButton>
                </Tooltip>
                <Tooltip
                  placement='right'
                  title="NYC DOT's Accessible Pedestrian Signals (APS) are devices affixed to pedestrian signal poles to assist blind or low vision pedestrians in crossing the street. APS are wired to a pedestrian signal and send audible and vibrotactile indications when pedestrians push a button installed at a crosswalk."
                >
                  <ToggleButton
                    value="signals"
                    style={getButtonStyles(selectedFeatures.includes('signals'), blue)}
                    aria-label="pedestrian signals"
                  >
                    Pedestrian Signals
                  </ToggleButton>
                </Tooltip>
                <Tooltip placement='right'
                  title="Represents a sidewalk ramp - hover over to see the width in inches.">
                  <ToggleButton
                    value="ramps"
                    style={getButtonStyles(selectedFeatures.includes('ramps'), orange)}
                    aria-label="pedestrian ramps"
                  >
                    Pedestrian Ramps
                  </ToggleButton>
                </Tooltip>
              </ToggleButtonGroup>
            </CardContent>
          </Card>
        </Box>
      </Control>
    </div>
  );
}
