import { Modal, Input, Space, Button, message } from 'antd'
import { useEffect, useState } from 'react'
import React from 'react'
import classnames from 'classnames/bind'
import s from './index.module.less'
const cx = classnames.bind(s)

type Props = {
  open: boolean
  info: any
  onChange: (data: any) => void
  onClose: () => void
}
const Index: React.FC<Props> = (props) => {
  const { info, open, onClose, onChange } = props
  const { title = '标题', parentName } = info
  const [value, setValue] = useState<string>()

  const handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const val = ev.target.value
    setValue(val)
  }

  const handleClose = () => {
    onClose()
    setValue('')
  }

  const handleOK = () => {
    if (!value) {
      message.error('请填写部门名称')
      return
    }
    onChange({
      value: value,
      ...info,
    })
  }

  useEffect(() => {
    if (open) {
      setValue(info.value)
    }
  }, [open])

  return (
    <Modal
      open={open}
      title={title}
      width={480}
      onCancel={handleClose}
      footer={
        <Space>
          <Button onClick={handleClose}>取消</Button>
          <Button type="primary" onClick={handleOK}>
            确定
          </Button>
        </Space>
      }
    >
      <div>
        <p className={cx('item')}>
          <span className={cx('label')}>部门名称：</span>
          <Input onChange={handleOnChange} value={value} />
        </p>
        <p className={cx('item')}>
          <span className={cx('label')}>上级部门：</span>
          <Input value={parentName} disabled />
        </p>
      </div>
    </Modal>
  )
}

export default Index
