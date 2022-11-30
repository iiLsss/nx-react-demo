import { RouterProvider } from 'react-router-dom'
import router from '../routes'
import { fetchUserInfo } from '../store/user'
import { useAppDispatch } from '../store'
import { useEffect } from 'react'

export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [])

  return <RouterProvider router={router} />
}

export default App
