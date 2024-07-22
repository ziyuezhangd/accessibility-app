import React from 'react';
import { Polyline } from 'react-google-map-wrapper';

const PREDICTION_COLORS = {
  'A': '#44ce1b',
  0: '#44ce1b',
  'B': '#44ce1b',
  1: '#44ce1b',
  'C': '#bbdb44',
  2: '#bbdb44',
  'D': '#f7e379',
  3: '#f7e379',
  'E': '#f2a134',
  4: '#f2a134',
  'F': '#e51f1f',
  5: '#e51f1f',
};
  
export default function PredictionLayer({predictionType, data, onLineClicked}) {
  return (
    <>
      {data && data.map((d, i) =>
      {
        const {location} = d;
        const prediction = d[predictionType];
        return (<Polyline
          key={i}
          path={[{ lat: location.start.lat, lng: location.start.lng }, { lat: location.end.lat, lng: location.end.lng }]}
          strokeColor={PREDICTION_COLORS[prediction]}
          strokeOpacity={prediction === 0 || prediction === 'A' ? 0.05 : 1.0}
          strokeWeight={8.0}
          geodesic
          clickable={true}
          onClick={(p, e) => onLineClicked(p, e, data)}
        />);}
      )}</>
  );
}
