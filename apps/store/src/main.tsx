import { StrictMode, useEffect } from 'react'
import * as ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './app/app'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
console.log(root)

root.render(
  // <StrictMode>
  <Provider store={store}>
    <App />
  </Provider>
  // </StrictMode>
)
