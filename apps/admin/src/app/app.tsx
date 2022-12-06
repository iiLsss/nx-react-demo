// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less'
import classNames from 'classnames/bind'
import { Route, Routes, Link, Outlet } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Home = lazy(() => import('../page/Home'))
const PageTwo = lazy(() => import('../page/PageTwo'))
const cx = classNames.bind(styles)

export function App() {
  return (
    <div className={cx('main-container')}>
      <div className={cx('sidler')}>
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>

      <div className={cx('content')}>
        <Suspense fallback={<p>loading ...</p>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/page-2" element={<PageTwo />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default App
