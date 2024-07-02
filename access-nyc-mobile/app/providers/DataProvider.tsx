// import _ from 'lodash';
// import { createContext, useState, useEffect } from 'react';
// import { getPlaceInfos } from '../services/placeInfo';
// import { getPublicRestrooms } from '../services/restrooms';
// import { PlaceInfo } from '../interfaces/PlaceInfo';

// const DataContext = createContext<{
//   placeInfos: PlaceInfo[];
// } | null>(null);

// const DataProvider = ({ children }: { children: React.ReactNode }) => {
//   const [restrooms, setRestrooms] = useState([]); // TODO
//   const [placeInfos, setPlaceInfos] = useState<PlaceInfo[]>([]);

//   useEffect(() => {
//     // loadRestrooms();
//     loadPlaceInfo();
//   }, []);

//   //   const loadRestrooms = async () => {
//   //     const restrooms = await getPublicRestrooms('incl-partial');
//   //     setRestrooms(restrooms);
//   //   };

//   const loadPlaceInfo = async () => {
//     const placeInfos = await getPlaceInfos();
//     setPlaceInfos(placeInfos);
//   };

//   return <DataContext.Provider value={{ placeInfos }}>{children}</DataContext.Provider>;
// };

// export { DataContext, DataProvider };
