import { Tree, Button, Modal } from 'antd'
import React, { useState } from 'react'
import classnames from 'classnames/bind'
import s from './index.module.less'
import { treeData, DataNode } from './const'
import ModalTree from '../../components/ModalTree'
import DeptAction from './DeptAction'
import {
  DeleteOutlined,
  PlusSquareOutlined,
  FormOutlined,
} from '@ant-design/icons'
const cx = classnames.bind(s)

const { TreeNode } = Tree

type TreeTitleProps = {
  item: DataNode
  onDelete: () => void
  onAdd: () => void
  onEdit: () => void
}
const TreeTitle: React.FC<TreeTitleProps> = ({
  item,
  onDelete,
  onAdd,
  onEdit,
}) => {
  const handleDelete = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation()
    onDelete()
  }
  const handleAdd = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation()
    onAdd()
  }
  const handleEdit = (ev: React.MouseEvent<HTMLDivElement>) => {
    ev.stopPropagation()
    onEdit()
  }

  return (
    <span className={`${cx('tree-item')} tree-item`}>
      <span>
        <span>{item.name as React.ReactNode}</span>
        <span>(tips)</span>
      </span>
      <span>
        <FormOutlined onClick={handleEdit} />
        <DeleteOutlined onClick={handleDelete} />
        <PlusSquareOutlined onClick={handleAdd} />
      </span>
    </span>
  )
}

const getTreeNode = (
  data: DataNode[],
  onAdd: (data: DataNode) => void,
  onDelete: (data: DataNode) => void,
  onEdit: (data: DataNode, parent?: DataNode) => void,
  parent?: DataNode
) => {
  if (data && data.length > 0) {
    return data.map((item) => {
      if (item.children) {
        return (
          <TreeNode
            key={item.deptId}
            title={
              <TreeTitle
                onEdit={() => onEdit(item, parent)}
                onAdd={() => onAdd(item)}
                onDelete={() => onDelete(item)}
                item={item}
              />
            }
          >
            {getTreeNode(item.children, onAdd, onDelete, onEdit, item)}
          </TreeNode>
        )
      }
      return (
        <TreeNode
          key={item.deptId}
          title={
            <TreeTitle
              onEdit={() => onEdit(item, parent)}
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

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editDeptInfo, setEditDeptInfo] = useState<any>({})

  const onSelect = (selectedKeys: React.Key[]) => {
    console.log(selectedKeys)
  }

  const handleAdd = (data: any) => {
    console.log(data)

    setEditDeptInfo({
      type: 'add',
      title: '新增部门',
      // parentId: data.
      parentName: data.name,
    })
    setIsModalOpen(true)
  }

  const handleDelete = (data: any) => {
    console.log(data)
  }

  const handleChange = (data: any) => {
    console.log(data)
    setDeptInfo(data)
  }

  const handleEdit = (self: any, parent: any) => {
    console.log(self, parent)
    setEditDeptInfo({
      type: 'edit',
      title: '修改部门名称',
      value: self.name,
      parentName: parent?.name || '公司名',
    })
    setIsModalOpen(true)
  }

  const handleEditDeptInfo = (data: any) => {
    console.log(data)
    // todo 调用接口
  }

  const handleDeptModal = () => {
    setEditDeptInfo({})
    setIsModalOpen(false)
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
          {getTreeNode(treeData, handleAdd, handleDelete, handleEdit)}
        </Tree>
      </div>
      <p></p>
      <ModalTree
        label={deptInfo.name}
        value={deptInfo.deptId}
        onChange={handleChange}
      />
      <DeptAction
        onClose={handleDeptModal}
        onChange={handleEditDeptInfo}
        open={isModalOpen}
        info={editDeptInfo}
      />
    </div>
  )
}

export default Index
