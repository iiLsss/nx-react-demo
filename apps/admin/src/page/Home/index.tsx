import { Route, Routes, Link } from 'react-router-dom'
import style from './index.module.less'
import classNames from 'classnames/bind'

const cx = classNames.bind(style)
export function App() {
  return (
    <div>
      <div
        className={cx('edit-div')}
        spellCheck="true"
        placeholder="xxx"
        data-content-editable-leaf="true"
        contentEditable="true"
      ></div>
    </div>
  )
}

export default App
