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

export const getPlaceInfos = () => {
  // TODO: actually call the endpoint
  return [dummyPlaceInfo];
};
