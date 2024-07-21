import _ from 'lodash';
import { createContext, useState, useEffect } from 'react';
import {getUserHistories} from '../services/userHistory';

const UserContext = createContext();

const UserProvider = ({children}) => {

  const [userHistories, setUserHistories] = useState([]);
    
  useEffect(() => {
    loadUserHistory();
  }, []);

  const loadUserHistory = async () => {
    try{
      const userHistories = await getUserHistories();
      setUserHistories(userHistories);}
    catch{
      console.log('no user history found');
    }
  };
  
  return (
    <UserContext.Provider value={{userHistories}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };