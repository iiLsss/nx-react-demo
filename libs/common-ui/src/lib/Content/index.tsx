import { Breadcrumb, Layout } from 'antd'
import { FC } from 'react'

const { Content } = Layout

const App: FC = (props) => (
  <Layout style={{ padding: '24px 24px' }}>
    {/* <Breadcrumb style={{ margin: '16px 0' }}>
      <Breadcrumb.Item>Home</Breadcrumb.Item>
      <Breadcrumb.Item>List</Breadcrumb.Item>
      <Breadcrumb.Item>App</Breadcrumb.Item>
    </Breadcrumb> */}
    <Content
      className="site-layout-background"
      style={{
        minHeight: 300,
        backgroundColor: '#fff',
      }}
    >
      {props.children}
    </Content>
  </Layout>
)

export default App
