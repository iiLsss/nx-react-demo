import React from 'react'
import { MainLayout } from '@integrated-react-test/common-ui'
import { Outlet } from 'react-router-dom'

const Index = () => {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
export default Index
