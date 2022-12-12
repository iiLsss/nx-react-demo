import { Link } from 'react-router-dom'
import style from './index.module.less'
import classNames from 'classnames/bind'
const cx = classNames.bind(style)
export function App() {
  const handleChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    console.log(ev)
  }

  return (
    <div>
      <Link to="/learn">LearnCenter</Link>
      <div
        className={cx('edit-div')}
        spellCheck="true"
        placeholder="xxx"
        data-content-editable-leaf="true"
        contentEditable="true"
        onInput={handleChange}
        // onChange={handleChange}
      ></div>
      {/* <input type="text" onChange={handleChange} /> */}
    </div>
  )
}

export default App
