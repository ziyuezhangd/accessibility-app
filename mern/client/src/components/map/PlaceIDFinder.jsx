import React, { useEffect } from 'react';

const googleMapConfig = import.meta.env.VITE_GOOGLEMAP_KEY;

const loadScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
};

const PlaceIDFinder = () => {
  useEffect(() => {
    const initMap = () => {
      const map = new google.maps.Map(document.getElementById('map'), {
        center: { lat: 40.7831, lng: -73.9712 }, // Manhattan, New York
        zoom: 13,
      });
      const input = document.getElementById('pac-input');
      const autocomplete = new google.maps.places.Autocomplete(input, {
        fields: ['place_id', 'geometry', 'formatted_address', 'name'],
      });

      autocomplete.bindTo('bounds', map);
      map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

      const infowindow = new google.maps.InfoWindow();
      const infowindowContent = document.getElementById('infowindow-content');
      infowindow.setContent(infowindowContent);

      const marker = new google.maps.Marker({ map: map });

      marker.addListener('click', () => {
        infowindow.open(map, marker);
      });

      autocomplete.addListener('place_changed', () => {
        infowindow.close();
        const place = autocomplete.getPlace();

        if (!place.geometry || !place.geometry.location) {
          return;
        }

        if (place.geometry.viewport) {
          map.fitBounds(place.geometry.viewport);
        } else {
          map.setCenter(place.geometry.location);
          map.setZoom(17);
        }

        marker.setPlace({
          placeId: place.place_id,
          location: place.geometry.location,
        });
        marker.setVisible(true);
        infowindowContent.children.namedItem('place-name').textContent = place.name;
        infowindowContent.children.namedItem('place-id').textContent = place.place_id;
        infowindowContent.children.namedItem('place-address').textContent = place.formatted_address;
        infowindow.open(map, marker);
      });
    };

    const initMapScript = async () => {
      if (!window.google) {
        try {
          await loadScript(`https://maps.googleapis.com/maps/api/js?key=${googleMapConfig}&libraries=places`);
          if (window.google) {
            initMap();
          }
        } catch (error) {
          console.error('Error loading Google Maps script:', error);
        }
      } else {
        initMap();
      }
    };

    initMapScript();
  }, []);

  return (
    <div>
      <input id="pac-input"
        className="controls"
        type="text"
        placeholder="Enter a location" />
      <div id="map"
        style={{ height: '400px' }}></div>
      <div id="infowindow-content">
        <span id="place-name"
          className="title"></span><br />
        Place ID <span id="place-id"></span><br />
        <span id="place-address"></span>
      </div>
    </div>
  );
};

export default PlaceIDFinder;
