import { Layout, Menu } from 'antd'
import React, { ReactNode, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
// import style from './index.module.scss'
// import classnames from 'classnames/bind'
const { Sider } = Layout

// const cx = classnames.bind(style)

type Props = {
  sider: SiderType[]
}

type ItemType = {
  key: string
  label: ReactNode
  children?: ItemType[]
}

export type SiderType = {
  path: string
  title: string
  children?: SiderType[]
}

function formatSider(items: SiderType[]) {
  const arr: ItemType[] = []
  items.forEach((i) => {
    const obj: ItemType = {
      label: <Link to={i.path}>{i.title}</Link>,
      key: i.path,
    }
    if (i.children?.length) {
      obj.key = i.title
      obj.children = formatSider(i.children)
    }
    arr.push(obj)
  })
  return arr
}

const App: React.FC<Props> = (props) => {
  // const { menuList } = props
  const [siderList, setSiderList] = useState<ItemType[]>([])
  useEffect(() => {
    if (props.sider.length) {
      const list = formatSider(props.sider)
      setSiderList(list)
    }
  }, [props.sider])

  return (
    <Sider width={200} className="site-layout-background">
      <Menu
        mode="inline"
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        style={{ height: '100%', borderRight: 0 }}
        items={siderList}
      />
    </Sider>
  )
}

export default App
