import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import './index.css';
import About from './pages/About';
import Landing from './pages/Landing';
import Map from './pages/Map';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <Landing />,
      },
    ],
  },
  {
    path: '/map',
    element: <App />,
    children: [
      {
        path: '/map',
        element: <Map />,
      },
    ],
  },
  {
    path: '/about',
    element: <App />,
    children: [
      {
        path: '/about',
        element: <About />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);