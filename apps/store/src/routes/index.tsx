import { lazy } from 'react'
import { createBrowserRouter } from 'react-router-dom'

import MainLayout from '../components/MainLayout'
import routers from './routers'
// import User from '../pages/User'
import Home from '../pages/Home'

// const Home = lazy(() => import('../pages/Home'))
const User = lazy(() => import('../pages/User'))

const router = [
  {
    path: '/',
    title: '首页',
    element: <MainLayout />,
    children: [
      {
        path: '',
        element: <Home />,
      },
      ...routers,
    ],
  },
  {
    path: '/user',
    title: '用户中心',
    element: <User />,
  },
]

export default createBrowserRouter(router)
