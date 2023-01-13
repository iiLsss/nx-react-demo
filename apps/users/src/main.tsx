import * as ReactDOM from 'react-dom/client'
import App from './app/app'
import './styles.less'
import './assets/index.less'
import { ABC } from '@integrated-react-test/auth'
import { Auth } from '@integrated-react-test/auth'
console.log(ABC)
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
  <>
    <App />
    <Auth />
  </>
)
