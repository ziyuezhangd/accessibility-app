import { Card, Box, Typography, CardContent, Tooltip } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { Circle,AdvancedMarker, Control } from 'react-google-map-wrapper';
import { DataContext } from '../../providers/DataProvider';

export default function AccessibilityMarkers() {
  const {pedestrianRamps, pedestrianSignals, seatingAreas} = useContext(DataContext);
  const [hoveredElement, setHoveredElement] = useState(null);

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
      {pedestrianRamps.map(({ width, latitude, longitude },i) => (
        <>
          <Circle
            key={`${latitude}${longitude}-${i}`}
            strokeColor="#C54BB9"
            strokeOpacity={0.8}
            strokeWeight={2}
            fillColor="#C54BB9"
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
      {pedestrianSignals.map(({ latitude, longitude }, i) => (
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor="#3EA5A1"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#3EA5A1"
          fillOpacity={0.35}
          center={{lat: latitude, lng: longitude}}
          radius={10}
        />
      ))}
      {seatingAreas.map(({ latitude, longitude, seatType, category }, i) => (
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor="#FF0000"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#FF0000"
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
              <Tooltip title='Represents a bench or leaning bar'
                placement='right'>
                <div className='flex flex-row space-x-2 items-center'>
                  <div style={{backgroundColor: '#FF0000', borderColor: '#FF0000', borderWidth: 4, opacity: 0.35, width: 15, height: 15, borderRadius: 10}}></div>
                  <Typography variant='subtitle1'>Seating Area</Typography>
                </div>
              </Tooltip>
              <Tooltip placement='right'
                title="NYC DOT's Accessible Pedestrian Signals (APS) are devices affixed to pedestrian signal poles to assist blind or low vision pedestrians in crossing the street. APS are wired to a pedestrian signal and send audible and vibrotactile indications when pedestrians push a botton installed at a crosswalk.">
                <div className='flex flex-row space-x-2 items-center'>
                  <div style={{backgroundColor: '#3EA5A1', borderColor: '#3EA5A1', borderWidth: 4, opacity: 0.35, width: 15, height: 15, borderRadius: 10}}></div>
                  <Typography variant='subtitle1'>Pedestrian Signal</Typography>
                </div>
              </Tooltip>
              <Tooltip placement='right'
                title="Represents a sidewalk ramp - hover over to see the width in inches.">
                <div className='flex flex-row space-x-2 items-center'>
                  <div style={{backgroundColor: '#C54BB9', borderColor: '#C54BB9', borderWidth: 4, opacity: 0.35, width: 15, height: 15, borderRadius: 10}}></div>
                  <Typography variant='subtitle1'>Pedestrian Ramp</Typography>
                </div></Tooltip>
            </CardContent>
          </Card>
        </Box>
      </Control>
    </div>
  );
}
