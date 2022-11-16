import { Banner, Button } from '@integrated-react-test/common-ui'
import { exampleProducts } from '@integrated-react-test/products'
import type { RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { counterActions } from '../../store/counter'

const Index = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()
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
      <Button onClick={() => dispatch(counterActions.increment())}>
        Increment
      </Button>
      <span>{count}</span>
      <Button onClick={() => dispatch(counterActions.decrement())}>
        Decrement
      </Button>
    </>
  )
}
export default Index
