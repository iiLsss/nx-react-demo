import { Modal, Button, Space, Select, Tree, Input, message } from 'antd'
import React, { useEffect, useState, useRef } from 'react'
import { treeData, DeptNode, DataNode } from './const'
import classnames from 'classnames/bind'
import s from './index.module.less'

const cx = classnames.bind(s)

const formatTreeData = (list: DeptNode[]) => {
  const copy = (data: DeptNode[]) => {
    const arr: DataNode[] = []
    data.forEach((item) => {
      const obj: DataNode = {
        key: item.deptId,
        name: item.name,
        title: `${item.name}（${item.num}）`,
      }
      if (item.children?.length) {
        obj.children = copy(item.children)
      }
      arr.push(obj)
    })
    return arr
  }
  return copy(list)
}

type Fn = () => Promise<DataNode[]>
const getDeptData: Fn = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const list = formatTreeData(treeData)
      console.log(list)
      resolve(list)
    }, 500)
  })
}

const { Search } = Input

type Props = {
  value: string
  label: string
  onChange: (data: React.Key[]) => void
}
const Index: React.FC<Props> = ({ label, value, onChange }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [treeData, setTreeData] = useState<DataNode[]>([])
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([])
  const [selectVal, setSelectVal] = useState<string>()

  const selectRef: any = useRef(null)
  const getList = async (val?: string) => {
    try {
      const data = await getDeptData()
      setTreeData(data)
    } catch (error) {
      console.log(error)
    }
  }

  const showModal = () => {
    getList()
    setIsModalOpen(true)
  }

  const handleOk = () => {
    if (!selectedKeys.length) {
      message.error('请选择部门')
      return
    }
    setIsModalOpen(false)

    onChange({
      ...selectRef.current,
    })
    setTreeData([])
  }

  const handleCancel = () => {
    setIsModalOpen(false)
    setTreeData([])
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    getList(value)
  }

  const onSelect = (sKey: React.Key[], e: any) => {
    const { name } = e.selectedNodes[0]
    console.log('object', name)
    setSelectedKeys(sKey)
    selectRef.current = {
      name,
      deptId: sKey[0],
    }
  }

  useEffect(() => {
    console.log(value)
    setSelectedKeys([value])
  }, [value])

  useEffect(() => {
    setSelectVal(label)
  }, [label])

  return (
    <>
      <div onClick={showModal}>
        <Select
          value={selectVal}
          open={false}
          style={{ width: 300 }}
          placeholder="custom dropdown render"
        />
      </div>

      <Modal
        title="打开"
        open={isModalOpen}
        onOk={handleOk}
        width={452}
        onCancel={handleCancel}
        footer={
          <Space>
            <Button onClick={handleCancel}>取消</Button>
            <Button onClick={handleOk} type="primary">
              确定
            </Button>
          </Space>
        }
      >
        <Search
          style={{ marginBottom: 8 }}
          placeholder="Search"
          onChange={onSearch}
        />
        <div className={cx('tree-wrap')}>
          <Tree
            selectedKeys={selectedKeys}
            onSelect={onSelect}
            treeData={treeData}
          />
        </div>
      </Modal>
    </>
  )
}

export default Index
