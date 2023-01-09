import { useEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './app/app'
import './assets/index.less'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
console.log(root)

root.render(
  <Provider store={store}>
    <>
      <App />
      <div className="box">123</div>
    </>
  </Provider>
)
