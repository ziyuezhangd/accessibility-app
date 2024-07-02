import _ from 'lodash';
import { useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';

export default function HighlightMarkers() {
  const { accessibilityHighlightPlaces } = useContext(DataContext);
  const { createMarkers } = useContext(GoogleMapContext);

  useEffect(() => {
    const showHighlightMarkers = (accessibilityHighlightPlaces) => {
      const markers = accessibilityHighlightPlaces.map(accessibilityHighlightPlaces => {
        const { coordinates } = accessibilityHighlightPlaces.location;
        return {
          lat: coordinates[1], 
          lng: coordinates[0], 
        };
      });
      createMarkers(markers);
    };

    if (accessibilityHighlightPlaces) {
      showHighlightMarkers(accessibilityHighlightPlaces);
    }
  }, [accessibilityHighlightPlaces, createMarkers]);

  return null; 
}