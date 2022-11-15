import React from 'react'
import { MainLayout } from '@integrated-react-test/common-ui'
import type { SiderType } from '@integrated-react-test/common-ui'
import { Outlet } from 'react-router-dom'

import { routerList } from '../../routes/routers'

console.log(routerList)

const Index = () => {
  return (
    <MainLayout sider={routerList}>
      <Outlet />
    </MainLayout>
  )
}
export default Index
