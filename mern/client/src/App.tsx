import './App.css';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import { Map } from './components/Map';

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
