import { Tree, Button } from 'antd'
import React, { useState } from 'react'
import classnames from 'classnames/bind'
import s from './index.module.less'
import { treeData, DataNode } from './const'
import ModalTree from '../../components/ModalTree'
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
const cx = classnames.bind(s)

const { TreeNode } = Tree

type TreeTitleProps = {
  item: DataNode
  onDelete: () => void
  onAdd: () => void
}
const TreeTitle: React.FC<TreeTitleProps> = ({ item, onDelete, onAdd }) => {
  return (
    <span className={`${cx('tree-item')} tree-item`}>
      <span>
        <span>{item.name as React.ReactNode}</span>
        <span>(tips)</span>
      </span>
      <span>
        <DeleteOutlined onClick={onDelete} />
        <PlusOutlined onClick={onAdd} />
      </span>
    </span>
  )
}

const getTreeNode = (
  data: DataNode[],
  onAdd: (data: DataNode) => void,
  onDelete: (data: DataNode) => void
) => {
  if (data && data.length > 0) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            key={item.deptId}
            title={
              <TreeTitle
                onAdd={() => onAdd(item)}
                onDelete={() => onDelete(item)}
                item={item}
              />
            }
          >
            {getTreeNode(item.children, onAdd, onDelete)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.deptId}
          title={
            <TreeTitle
              onAdd={() => onAdd(item)}
              onDelete={() => onDelete(item)}
              item={item}
            />
          }
        />
      )
    })
  }
  return []
}

const defaultValue = '0-0-2'

const Index: React.FC = () => {
  // const [autoExpandParent, setAutoExpandParent] = useState<boolean>(true)

  // const onExpand = (expandedKeysValue: React.Key[]) => {
  //   console.log('onExpand', expandedKeysValue)
  //   setExpandedKeys(expandedKeysValue)
  //   setAutoExpandParent(false)
  // }
  const [deptInfo, setDeptInfo] = useState({
    deptId: defaultValue,
    name: defaultValue,
  })

  const onSelect = (selectedKeys: React.Key[]) => {
    console.log(selectedKeys)
  }

  const handleAdd = (data: any) => {
    console.log(data)
  }

  const handleDelete = (data: any) => {
    console.log(data)
  }

  const handleChange = (data: any) => {
    console.log(data)
    setDeptInfo(data)
  }

  return (
    <div className={cx('wrap')}>
      <div className={cx('tree-wrap')}>
        <Tree
          // onExpand={onExpand}
          // expandedKeys={expandedKeys}
          // autoExpandParent={autoExpandParent}
          height={600}
          onSelect={onSelect}
        >
          {getTreeNode(treeData, handleAdd, handleDelete)}
        </Tree>
      </div>
      <p></p>
      <ModalTree
        label={deptInfo.name}
        value={deptInfo.deptId}
        onChange={handleChange}
      />
    </div>
  )
}

export default Index
