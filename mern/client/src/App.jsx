import './App.css';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { Outlet } from 'react-router-dom';

const App = () => {
  return (
    <div className='w-full p-6'>
      <Outlet />
    </div>
  );
};
export default App;
