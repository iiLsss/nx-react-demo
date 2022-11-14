import React from 'react'
import { Banner, Button } from '@integrated-react-test/common-ui'
import { exampleProducts } from '@integrated-react-test/products'

const Index = () => {
  return (
    <>
      <Banner text="welcome to the nx monorepo" />
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
export default Index
