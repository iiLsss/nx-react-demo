import React from 'react'
import classnames from 'classnames/bind'
import style from './index.module.less'
import { UnorderedListOutlined } from '@ant-design/icons'
const cx = classnames.bind(style)

const Index = () => {
  return (
    <div className={cx('wrap')}>
      <UnorderedListOutlined />
      <div>learn - center</div>
    </div>
  )
}
export default Index
