import _ from 'lodash';
import React, { useContext, useEffect, useState } from 'react';
import PlaceInfoPopup from './PlaceInfoPopup';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { categoryToParentCategory, PlaceInfoUtilities } from '../../services/placeInfo';

export default function PlaceInfoLayer({filter}) {
  const { createMarkers, clearMarkers, markers} = useContext(GoogleMapContext);
  const { placeInfos } = useContext(DataContext);

  const [selectedPlace, setSelectedPlace] = useState(null);

  // When place infos are loaded, render accessibility markers
  useEffect(() => {
    const showAccessibilityMarkers = (placeInfos) => {
      const configs = placeInfos.map((placeInfo, i) => {
        const imgSrc = PlaceInfoUtilities.getMarkerPNG(placeInfo);
        if (imgSrc === null){
          console.log('Could not find imgSrc for', placeInfo);
          return null;
        }
        if (_.includes(filter, categoryToParentCategory(placeInfo.category)) || _.includes(filter, 'All')) {
          return {
            lat: placeInfo.latitude,
            lng: placeInfo.longitude,
            imgSrc,
            imgSize: '30px', 
            imgAlt: placeInfo.name,
            key: i,
            category: categoryToParentCategory(placeInfo.category),
            onClick: () => handleMarkerClick(placeInfo),
          }; 
        } else {
          return null;
        }
      });
      const filteredMarkers = configs.filter( (marker) => marker !== null); 
      createMarkers(filteredMarkers, 'placeInfo', true);
    };

    if (placeInfos) {
      console.log('Showing accessibility markers');
      showAccessibilityMarkers(placeInfos);
    }
  }, [placeInfos, filter]);

  const handleMarkerClick = async (placeInfo) => {
    console.log('Marker clicked');
    setSelectedPlace(placeInfo);
  };

  return (
    <div>
      {
        markers['placeInfo'].map(marker => marker)
      }
      {selectedPlace !== null &&
      <PlaceInfoPopup
        open={selectedPlace !== null}
        onClose={() => setSelectedPlace(null)}
        placeInfo={selectedPlace}
      />
      }
    </div>
  );
}