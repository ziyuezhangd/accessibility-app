import { Card, Box, Typography, CardContent, Tooltip, Switch, styled, alpha, FormControlLabel, FormGroup } from '@mui/material';
import { blue, green, orange, pink, purple, yellow } from '@mui/material/colors';
import React, { useContext, useEffect, useState } from 'react';
import { Circle,AdvancedMarker, Control } from 'react-google-map-wrapper';
import { DataContext } from '../../providers/DataProvider';

const PurpleSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: purple[600],
    '&:hover': {
      backgroundColor: alpha(purple[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: purple[600],
  },
}));
const BlueSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: blue[600],
    '&:hover': {
      backgroundColor: alpha(blue[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: blue[600],
  },
}));
const OrangeSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: orange[600],
    '&:hover': {
      backgroundColor: alpha(orange[600], theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: orange[600],
  },
}));

export default function AccessibilityMarkers() {
  const {pedestrianRamps, pedestrianSignals, seatingAreas} = useContext(DataContext);
  const [hoveredElement, setHoveredElement] = useState(null);
  const [showPedestrianRamps, setShowPedestrianRamps] = useState(true);
  const [showPedestrianSignals, setShowPedestrianSignals] = useState(true);
  const [showSeatingAreas, setShowSeatingAreas] = useState(true);

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
  
  return (
    <div>
      {showPedestrianRamps && pedestrianRamps.map(({ width, latitude, longitude },i) => (
        <>
          <Circle
            key={`${latitude}${longitude}-${i}`}
            strokeColor={orange[600]}
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor={orange[600]}
            fillOpacity={0.35}
            center={{lat: latitude, lng: longitude}}
            radius={10}
            onMouseOver={() => setHoveredElement(`${latitude}${longitude}-${i}`)}
            onMouseOut={() => setHoveredElement(null)}
          />
          {hoveredElement === `${latitude}${longitude}-${i}` && <AdvancedMarker lat={latitude}
            lng={longitude}>
            <div className='px-2 py-2 rounded bg-[#0af] text-sm text-white'>
              {width}&quot;
            </div>
          </AdvancedMarker>}
        </>
      ))}
      {showPedestrianSignals && pedestrianSignals.map(({ latitude, longitude }, i) => (
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor={blue[600]}
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor={blue[600]}
          fillOpacity={0.35}
          center={{lat: latitude, lng: longitude}}
          radius={10}
        />
      ))}
      {showSeatingAreas && seatingAreas.map(({ latitude, longitude, seatType, category }, i) => (
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor={purple[600]}
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor={purple[600]}
          fillOpacity={0.35}
          center={{lat: latitude, lng: longitude}}
          radius={10}
        />
      ))}
      <Control position={google.maps.ControlPosition.LEFT_BOTTOM}>
        <Box sx={{ minWidth: 275 }}>
          <Card variant='outlined'>
            <CardContent>
              <Typography variant='subtitle1'>Key</Typography>
              <FormGroup>
                <Tooltip title='Represents a bench or leaning bar'
                  placement='right'>
                  <FormControlLabel
                    value="seatingAreas"
                    control={(
                      <PurpleSwitch
                        checked={showSeatingAreas}
                        onChange={(e) => setShowSeatingAreas(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    )}
                    label="Seating Areas"
                    labelPlacement="end"
                  />
                </Tooltip>
             
                <Tooltip placement='right'
                  title="NYC DOT's Accessible Pedestrian Signals (APS) are devices affixed to pedestrian signal poles to assist blind or low vision pedestrians in crossing the street. APS are wired to a pedestrian signal and send audible and vibrotactile indications when pedestrians push a botton installed at a crosswalk.">
                  <FormControlLabel
                    value="pedestrianSignals"
                    control={(
                      <BlueSwitch
                        checked={showPedestrianSignals}
                        onChange={(e) => setShowPedestrianSignals(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    )}
                    label="Pedestrian Signals"
                    labelPlacement="end"
                  />
                </Tooltip>
                <Tooltip placement='right'
                  title="Represents a sidewalk ramp - hover over to see the width in inches.">
                  <FormControlLabel
                    value="seatingAreas"
                    control={(
                      <OrangeSwitch
                        checked={showPedestrianRamps}
                        onChange={(e) => setShowPedestrianRamps(e.target.checked)}
                        inputProps={{ 'aria-label': 'controlled' }}
                      />
                    )}
                    label="Pedestrian Ramps"
                    labelPlacement="end"
                  />
                </Tooltip>
              </FormGroup>
            </CardContent>
          </Card>
        </Box>
      </Control>
    </div>
  );
}
