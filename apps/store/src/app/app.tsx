import { RouterProvider } from 'react-router-dom'
import router from '../routes'
import { API_RUL } from '../constants'

console.log(API_RUL)
export function App() {
  return <RouterProvider router={router} />
}

export default App
