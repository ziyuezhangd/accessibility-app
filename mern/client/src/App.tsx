import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Map } from './components/Map';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const App = () => {
  return (
    <div className='w-full p-6'>
      <Navbar />
      <Map />
      <Outlet />
    </div>
  );
};
export default App;
