import { Layout, Menu } from 'antd'
import React from 'react'
// import style from './index.module.scss'
// import classnames from 'classnames/bind'
const { Sider } = Layout

// const cx = classnames.bind(style)

type Props = {
  // menuList: []
}

const App: React.FC<Props> = (props) => {
  // const { menuList } = props
  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
        items={[]}
      />
    </Sider>
  )
}

export default App
