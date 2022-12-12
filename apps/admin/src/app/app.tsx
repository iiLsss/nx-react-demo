import styles from './app.module.less'
import classNames from 'classnames/bind'
import { RouterProvider } from 'react-router-dom'
import { Suspense } from 'react'

import router from '../router'
const cx = classNames.bind(styles)

export function App() {
  return (
    <div className={cx('main-container')}>
      <Suspense fallback={<p>loading ...</p>}>
        <RouterProvider router={router} />
      </Suspense>
    </div>
  )
}

export default App
