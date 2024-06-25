import _ from 'lodash';

/**
 *
 * Queries the backend for restrooms
 *
 * @returns Restroom object:
 * {
*  name: string,
*  status: string,
*  hours: string,
*  isAccessible: boolean,
*  isFullyAccessible: boolean,
*  isPartiallyAccessible: boolean,
*  restroomType: string,
*  hasChangingStations: boolean,
*  url: string,
*  latitude: string,
*  longitude: string
 * }
 */
export const getPublicRestrooms = async (accessibility = 'all') => {
  const response = await fetch('/api/restrooms?' + new URLSearchParams({ accessibility }));

  const restrooms = await response.json();
  if (restrooms.error) {
    console.error(restrooms.error);
    return;
  }
  return restrooms;
};
