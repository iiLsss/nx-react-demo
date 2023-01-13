import styles from './auth.module.less'
import { Tree } from 'antd'
import type { DataNode, TreeProps } from 'antd/es/tree'
/* eslint-disable-next-line */
export interface AuthProps {}

const treeData: DataNode[] = [
  {
    title: 'xxxx公司',
    key: '0-0',
    children: [
      {
        title: '行政',
        key: '0-0-0',
        disabled: true,
        children: [
          {
            title: '人事',
            key: '0-0-0-0',
            disableCheckbox: true,
          },
          {
            title: '财务',
            key: '0-0-0-1',
          },
        ],
      },
      {
        title: '技术',
        key: '0-0-1',
        children: [
          {
            title: <span style={{ color: '#1890ff' }}>开发</span>,
            key: '0-0-1-0',
          },
        ],
      },
    ],
  },
]

export function Auth(props: AuthProps) {
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info)
  }

  const onCheck: TreeProps['onCheck'] = (checkedKeys, info) => {
    console.log('onCheck', checkedKeys, info)
  }

  const onClick = (data: DataNode) => {
    console.log(data)
  }

  return (
    <div className={styles['container']}>
      <h1>Welcome to Auth!</h1>
      <Tree
        checkable
        defaultExpandedKeys={['0-0-0', '0-0-1']}
        defaultSelectedKeys={['0-0-0', '0-0-1']}
        defaultCheckedKeys={['0-0-0', '0-0-1']}
        onSelect={onSelect}
        onCheck={onCheck}
        treeData={treeData}
        titleRender={(nodeDate) => {
          return (
            <div onClick={() => onClick(nodeDate)}>
              {nodeDate.title as React.ReactNode}
            </div>
          )
        }}
      />
    </div>
  )
}

export default Auth
