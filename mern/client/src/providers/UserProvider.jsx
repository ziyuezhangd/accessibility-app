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
    const userHistories = await getUserHistories();
    setUserHistories(userHistories);
  };
  
  return (
    <UserContext.Provider value={{userHistories}}>
      {children}
    </UserContext.Provider>
  );
};

export { UserContext, UserProvider };