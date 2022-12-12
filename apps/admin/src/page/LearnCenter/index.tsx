import React from 'react'
import classnames from 'classnames/bind'
import style from './index.module.less'
import Header from '../../components/Header'
const cx = classnames.bind(style)

const Index = () => {
  return (
    <div className={cx('wrap')}>
      <Header />
      <section></section>
      <nav></nav>
    </div>
  )
}
export default Index
