import { createContext, useState, useEffect } from 'react';
import { getPlaceInfos } from '../services/PlaceInfoApi';
import { getPublicRestrooms } from '../services/RestroomsApi';
import { PlaceInfo } from '../interfaces/PlaceInfo';
import { PublicRestroom } from '../interfaces/PublicRestroom';

export interface DataContextType {
  placeInfos: PlaceInfo[];
  restrooms: PublicRestroom[];
}
const DataContext = createContext<DataContextType | null>(null);

const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [restrooms, setRestrooms] = useState<PublicRestroom[]>([]); // TODO
  const [placeInfos, setPlaceInfos] = useState<PlaceInfo[]>([]);

  useEffect(() => {
    loadRestrooms();
    loadPlaceInfo();
  }, []);

  const loadRestrooms = async () => {
    const restrooms = await getPublicRestrooms('incl-partial');
    setRestrooms(restrooms);
  };

  const loadPlaceInfo = async () => {
    const placeInfos = await getPlaceInfos();
    setPlaceInfos(placeInfos);
  };

  return <DataContext.Provider value={{ placeInfos, restrooms }}>{children}</DataContext.Provider>;
};

export { DataContext, DataProvider };
