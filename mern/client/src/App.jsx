import './App.css';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '@fontsource/playfair-display';
import { Outlet } from 'react-router-dom';
import { NavBar } from './components/NavBar';
import { UserProvider } from './providers/UserProvider';

const App = () => {
  return (
    <div className='w-full'>
      <UserProvider>
        <NavBar />
      </UserProvider>
      <Outlet />
    </div>
  );
};

export default App;