import { StrictMode } from 'react'
import * as ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import App from './app/app'

import { configureStore } from '@reduxjs/toolkit'
import { Provider } from 'react-redux'

import { STORE_FEATURE_KEY, storeReducer } from './app/store.slice'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

const store = configureStore({
  reducer: { [STORE_FEATURE_KEY]: storeReducer },
  // Additional middleware can be passed to this array
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env['NODE_ENV'] !== 'production',
  // Optional Redux store enhancers
  enhancers: [],
})

root.render(
  <Provider store={store}>
    <StrictMode>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </StrictMode>
  </Provider>
)
