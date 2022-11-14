// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.less'
import { Banner } from '@integrated-react-test/common-ui'

import { Route, Routes, Link } from 'react-router-dom'

export function App() {
  return (
    <>
      <Banner text="Welcome to our admin app." />
      <br />
      <div role="navigation">
        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/page-2">Page 2</Link>
          </li>
        </ul>
      </div>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              This is the generated root route.{' '}
              <Link to="/page-2">Click here for page 2.</Link>
            </div>
          }
        />
        <Route
          path="/page-2"
          element={
            <div>
              <Link to="/">Click here to go back to root page.</Link>
            </div>
          }
        />
      </Routes>
      {/* END: routes */}
    </>
  )
}

export default App
