import React, { useContext, useEffect } from 'react';
import { Circle } from 'react-google-map-wrapper';
import { DataContext } from '../../providers/DataProvider';

export default function AccessibilityMarkers() {
  const {pedestrianRamps, pedestrianSignals, seatingAreas} = useContext(DataContext);

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
        <Circle
          key={`${latitude}${longitude}-${i}`}
          strokeColor="#C54BB9"
          strokeOpacity={0.8}
          strokeWeight={2}
          fillColor="#C54BB9"
          fillOpacity={0.35}
          center={{lat: latitude, lng: longitude}}
          radius={10}
        />
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
    </div>
  );
}
