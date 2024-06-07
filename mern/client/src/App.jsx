import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Outlet } from 'react-router-dom';
import { NavBar } from './components/NavBar';

const App = () => {
  return (
    <div className='w-full'>
      <NavBar />
      <Outlet />
    </div>
  );
};
export default App;
