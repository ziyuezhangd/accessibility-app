import { Avatar, AvatarGroup, Box, Typography, Link } from '@mui/material';
import { useState, useEffect, useContext } from 'react';
import { DataContext } from '../../providers/DataProvider';
import { GoogleMapContext } from '../../providers/GoogleMapProvider';
import { PlaceInfo, PlaceInfoUtilities } from '../../services/placeInfo';
import { SUBWAY_LINE_COLORS, calculateDistanceBetweenTwoCoordinates } from '../../utils/MapUtils';

/**
 * 
 * This component retrieves and displays a list of nearest subway stations based on given coordinates.
 * 
 * @param {Object} props - The properties passed to the component.
 * @param {number} props.lat - The latitude coordinate.
 * @param {number} props.lng - The longitude coordinate.
 * 
 * @returns {JSX.Element} The rendered NearestStations component.
 */
export default function NearestStations({ lat, lng }) {
  const { placeInfos } = useContext(DataContext);
  const { createMarkers, removeMarkers } = useContext(GoogleMapContext);
  const [nearestStations, setNearestStations] = useState([]);

  useEffect(() => {
    // TODO: merge stations like Fulton Street
    const getNearestSubwayStations = async () => {
      
      const placeInfosObj = placeInfos.map(pi => new PlaceInfo(pi));
      const stations = placeInfosObj.filter((place) => place.isSubwayStation() && place.name !== '');
      const nearestStations = PlaceInfoUtilities.getNearest(stations, lat, lng, 3);

      // Remove duplicate stations
      const uniqueNearestStations = nearestStations.filter((station, index, self) => 
        index === self.findIndex((s) => s.name === station.name)
      );

      console.log(uniqueNearestStations);
      setNearestStations(uniqueNearestStations);
      showStationMarkers(uniqueNearestStations);
    };

    const showStationMarkers = (stations) => {
      console.log('showStationMarkers',stations);
      const markers = stations.map(station => ({
        lat: station.latitude,
        lng: station.longitude,
        imgSrc: null, // No image source, using pin element
        color: 'blue', // Marker color blue for consistency
        scale: 0.8, // Scale the marker for visibility
        title: station.getSubwayStationName(),
      }));
      createMarkers(markers, false); // Add markers without clearing existing markers
    };

    getNearestSubwayStations();

    return () => {
      const markersToRemove = nearestStations.map(station => ({
        lat: station.latitude,
        lng: station.longitude,
      }));
      removeMarkers(markersToRemove);
    };
  }, [lat, lng, placeInfos, createMarkers, removeMarkers]);

  return (
    <Box display='flex' flexDirection='column' alignItems='flex-start'>
      <Typography 
        variant='h6'
        sx={{ fontWeight: 400, fontSize: 18 }}
      >
        Wheelchair accessible subway stations
      </Typography>
      {nearestStations.map((station, index) => {
        const distance = calculateDistanceBetweenTwoCoordinates(lat, lng, station.latitude, station.longitude);

        return (
          <Box 
            key={`${station.name}-${index}`} 
            mb={2}
          >
            <AvatarGroup max={100}> {/* Set max to a high value */}
              {station.getSubwayLines().map((line) => (
                <Avatar 
                  key={`${station.name}-${line}`}
                  sx={{ bgcolor: SUBWAY_LINE_COLORS[line], fontSize: line === 'PATH' ? 10 : 20 }}
                >
                  {line}
                </Avatar>
              ))}
            </AvatarGroup>
            <Typography variant='body1'>{station.getSubwayStationName()}</Typography>
            <Typography>{Math.round(distance)} m</Typography> {/* Display actual distance */}
          </Box>
        );
      })}
      <Box mt={3}>
        <Typography variant='body2'>
          View the full accessible station map on the{' '}
          <Link href="https://new.mta.info/map/5346" target="_blank" rel="noopener">
            MTA website
          </Link>
          .
        </Typography>
      </Box>
    </Box>
  );
}
