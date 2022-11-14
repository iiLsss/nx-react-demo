import { createBrowserRouter } from 'react-router-dom'

import Home from '../pages/Home'
import User from '../pages/User'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    // children: [
    //   {
    //     path: 'team',
    //     element: <Team />,
    //     loader: teamLoader,
    //   },
    // ],
  },
  {
    path: '/user',
    element: <User />
  }
])

export default router