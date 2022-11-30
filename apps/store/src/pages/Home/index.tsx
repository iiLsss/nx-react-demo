import { Banner, Button } from '@integrated-react-test/common-ui'
import { exampleProducts } from '@integrated-react-test/products'
import type { RootState } from '../../store'
import { useSelector, useDispatch } from 'react-redux'
import { counterActions } from '../../store/counter'
import { internationalCode } from '@eeo/international'
import { useEffect } from 'react'

const Index = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  useEffect(() => {
    // internationalCode().then((res: any) => {
    //   console.log(res)
    // })
  }, [])

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
      <p></p>
      <img width="200" src="./assets/play-video.png" alt="" />
    </>
  )
}
export default Index
