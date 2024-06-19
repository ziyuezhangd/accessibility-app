import { API_HOST } from './utils';

const dummyPlaceInfo = {
  type: 'Feature',
  geometry: { type: 'Point', coordinates: [-73.967895, 40.697597] },
  properties: {
    _id: '3XMZXCFerj4HvoHyK',
    originalId: '4046001489',
    category: 'coffee',
    name: { en: 'Brooklyn Roasting Company' },
    accessibility: { accessibleWith: { wheelchair: true } },
    sourceId: 'LiBTS67TjmBcXdEmX',
    sourceImportId: 'fCcoz2Bn3YftLnQSP',
    sourceName: 'Wheelmap',
    organizationName: 'Sozialhelden e.V.',
    hasAccessibility: true,
    organizationId: 'LPb4y2ri7b6fLxLFa',
  },
};

export const getPlaceInfos = async () => {
  const response = await fetch(`${API_HOST}/place-infos`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const placeInfo = await response.json();
  return placeInfo;
};

export const getCategories = async () => {
  const response = await fetch(`${API_HOST}/place-infos/categories`);
  if (!response.ok) {
    const message = `An error has occurred: ${response.statusText}`;
    console.error(message);
    return;
  }
  const categories = await response.json();
  return categories;
};
