import React, { useState, useRef, useEffect, PropsWithChildren } from 'react'
import classnames from 'classnames/bind'
import style from './index.module.less'
import Form, { FromHandle } from './Form'
import { Button, Modal } from 'antd'
import { store } from '../../store/index'
import { useAppSelector } from '../../store'

const cx = classnames.bind(style)

type Props = {
  children?: React.ReactNode
}
const TestChildren: React.FC<Props> = (props) => {
  console.log(props.children)
  return <div>{props.children}</div>
}

const Index = () => {
  const { permissionIds } = useAppSelector((state) => state.user)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const formRef = useRef<FromHandle>(null)

  const handleOpenForm = () => {
    setIsModalOpen(true)
  }

  const handleSubmit = () => {
    formRef.current?.getValues()
  }

  useEffect(() => {
    console.log(permissionIds)
    console.log(store.getState())
  }, [])

  return (
    <div className={cx('wrap')}>
      <Button onClick={handleOpenForm}>打开</Button>
      <Modal title="弹窗" open={isModalOpen} onOk={handleSubmit}>
        <Form list={[]} ref={formRef} />
      </Modal>
      <TestChildren>
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
      </TestChildren>
    </div>
  )
}
Index.haveAuth = () => {
  console.log('object')
}
// const useHaveAuth = (permissionId) => {
//   // const { permissionIds, userInfo } = store
//   return userInfo.isAdmin || permissionIds.includes(permissionId)
// }

export default Index
