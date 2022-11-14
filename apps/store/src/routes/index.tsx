import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../components/MainLayout'
import Home from '../pages/Home'
import User from '../pages/User'
// import User from '../pages/User'

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      {
        path: 'course',
        element: <User />,
      },
    ],
  },
  {
    path: '/user',
    element: <User />,
  },
])

export default router
