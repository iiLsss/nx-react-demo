import React from 'react'
import { Auth } from '@integrated-react-test/auth'
import classnames from 'classnames/bind'
import style from './index.module.less'
const cx = classnames.bind(style)

const Index = () => {
  return (
    <div className={cx('wrap')}>
      <Auth></Auth>
    </div>
  )
}
export default Index
