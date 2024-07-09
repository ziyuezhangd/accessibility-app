import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import App from './App';
import './index.css';
import AboutPage from './pages/AboutPage';
import LandingPage from './pages/LandingPage';
import MapPage from './pages/MapPage';
import ResourcesPage from './pages/ResourcesPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <LandingPage />,
      },
    ],
  },
  {
    path: '/map',
    element: <App />,
    children: [
      {
        path: '/map',
        element: <MapPage />,
      },
    ],
  },
  {
    path: '/about',
    element: <App />,
    children: [
      {
        path: '/about',
        element: <AboutPage />,
      },
    ],
  },
  {
    path: '/resources',
    element: <App />,
    children: [
      {
        path: '/resources',
        element: <ResourcesPage />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);