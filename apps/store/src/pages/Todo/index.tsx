import React from 'react'
import classnames from 'classnames/bind'
import { Input } from 'antd'
import { Button } from '@integrated-react-test/common-ui'
import style from './index.module.less'
const cx = classnames.bind(style)

const Index = () => {
  return (
    <div className={cx('wrap')}>
      <div>
        <Input />
        <Button>添加</Button>
      </div>
    </div>
  )
}
export default Index
