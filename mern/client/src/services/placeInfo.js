/**
 *
 * Queries the backend for all accessibility cloud place infos in Manhattan
 * which are fully wheelchair accessible.
 * 
 * @returns Place Info object:
 * {
 *  category: string,
 *  name: string,
 *  address: string,
 *  latitude: number,
 *  longitude: number,
 * }
 */
export const getPlaceInfos = async () => {
  const response = await fetch(`/api/place-infos`);

  const placeInfo = await response.json();
  if (placeInfo.error) {
    console.error(placeInfo.error);
    return;
  }
  return placeInfo;
};

/**
 *
 * Queries the backend for all possible placeInfo categories
 * 
 * @returns Array of categories (strings)
 */
export const getCategories = async () => {
  const response = await fetch(`/api/place-infos/categories`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const categories = await response.json();
  return categories;
};
