import { Banner, Button } from '@integrated-react-test/common-ui'
import { exampleProducts } from '@integrated-react-test/products'
import { RouterProvider } from 'react-router-dom'
import router from '../routes'

export function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Banner text="welcome to the lsss" />
      <ul>
        {exampleProducts.map((product) => (
          <li key={product.id}>
            <strong>{product.name}</strong> Price: {product.price}
          </li>
        ))}
      </ul>
      <p className="font-orange"></p>
      <Button type="primary">按钮</Button>
    </>
  )
}

export default App
