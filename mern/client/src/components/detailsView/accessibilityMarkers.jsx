import _ from 'lodash';
import { useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfoUtilities } from '../../services/placeInfo';

export default function AccessibleMarkers() {
  const { placeInfos } = useContext(DataContext);
  const { createMarkers } = useContext(GoogleMapContext);

  useEffect(() => {
    const showAccessibilityMarkers = (placeInfos) => {
      const markers = placeInfos.map(placeInfo => {
        return {
          lat: placeInfo.latitude,
          lng: placeInfo.longitude,
          imgSrc: PlaceInfoUtilities.getMarkerPNG(placeInfo),
          imgSize: 2, 
          imgAlt: PlaceInfoUtilities.name,
        };
      });
      createMarkers(markers);
      console.log(markers);
    };

    if (placeInfos) {
      showAccessibilityMarkers(placeInfos);
    }
  }, [placeInfos, createMarkers]);

  return null; 
}