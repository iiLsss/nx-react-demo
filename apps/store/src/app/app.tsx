import { RouterProvider } from 'react-router-dom'
import router from '../routes'
import { API_RUL } from '../constants'
import { fetchUserInfo } from '../store/user'
import { useAppDispatch } from '../store'
import { useEffect } from 'react'
console.log(API_RUL)
export function App() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchUserInfo())
  }, [])

  return <RouterProvider router={router} />
}

export default App
