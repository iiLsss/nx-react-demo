import Sider, { SiderType } from '../Sider'
import Header from '../Header'
import Content from '../Content'
import { Layout } from 'antd'
import classnames from 'classnames/bind'
import style from './index.module.less'
import { FC, PropsWithChildren } from 'react'

const cx = classnames.bind(style)
type Props = PropsWithChildren<{ sider: SiderType[] }>

export const MainLayout: FC<Props> = (props) => {
  return (
    <Layout className={cx('layout')}>
      <Header />
      <Layout>
        <Sider sider={props.sider} />
        <Content>{props.children}</Content>
      </Layout>
    </Layout>
  )
}

export default MainLayout
