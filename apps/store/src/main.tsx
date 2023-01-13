import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from './store'
import App from './app/app'
import './assets/index.less'

ReactDOM.render(
  <Provider store={store}>
    <>
      <a href="">我是a标签哈哈哈哈</a>

      <App />
      <div className="box">123</div>
    </>
  </Provider>,
  document.getElementById('root') as HTMLElement
)
