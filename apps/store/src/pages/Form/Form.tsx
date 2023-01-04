import { Modal, Row, Col, Button, Input, Form } from 'antd'
import { PlusOutlined, EnvironmentOutlined } from '@ant-design/icons'
import {
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  ForwardedRef,
} from 'react'
import classnames from 'classnames/bind'
// import SvgIcon from '@/components/SvgIcon'
// import { BUSINESS_TYPE } from '@/consts'
// import CommonFileUpload from '@/components/CommonFileUpload'
// import {
//   letterOCRSendAddress,
//   letterOCRCompanyName,
//   letterOCRBatch,
// } from '@/api/correspondence'
import { list } from 'postcss'
import style from './index.module.less'

const cx = classnames.bind(style)

export type FromHandle = {
  getValues: () => void
}

const UploadPic = (props: { onSuccess: any; onChange: any }) => {
  return (
    // <CommonFileUpload
    //   uploadSuccessCallback={props.onSuccess}
    //   uploadChange={props.onChange}
    //   businessType={'aaa'}
    // >
    <a>
      {/* <SvgIcon iconName="_ic_general_picture" space={4} /> */}
      回函面单
    </a>
    // {/* </CommonFileUpload> */}
  )
}

type Props = {
  list: any[]
}

const Index: React.ForwardRefRenderFunction<FromHandle, Props> = (
  props,
  ref
) => {
  const [form] = Form.useForm()

  // 解析对方回函地址图片
  const analyzeSendAddress = async (id: any) => {
    try {
      // const { data } = await letterOCRSendAddress({
      //   fileId: id,
      // })
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  // 解析对方公司名
  const analyzeCompanyName = async (id: undefined) => {
    try {
      // const { data } = await letterOCRCompanyName({
      //   fileId: id,
      // })
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }
  // 批量识别
  const analyzeAllType = async (ids: any[]) => {
    try {
      // const { data } = await letterOCRCompanyName({
      //   fileIds: ids,
      // })
      // console.log(data)
    } catch (error) {
      console.log(error)
    }
  }

  // 回函地址
  const uploadSuccess = async (
    file: { id: any },
    type: string,
    key: number
  ) => {
    console.log(file, type, key)
    // const oldList = [...form.getFieldValue('list')]
    // oldList[key] = {
    //   ...oldList[key],

    // }
    // form.setFieldsValue({
    //   list:
    // })
    if (type === 'replayFromAddr') {
      analyzeSendAddress(file.id)
    }
    if (type === 'companyName') {
      analyzeCompanyName(file.id)
    }
  }

  const uploadChange = () => {
    console.log('first')
  }

  const handleDelete = (
    removeFn: (index: number | number[]) => void,
    key: number
  ) => {
    const data = form.getFieldValue('list')
    if (data.length === 1) {
      return
    }
    removeFn(key)
  }

  useImperativeHandle(ref, () => ({
    getValues: () => form.getFieldsValue(),
  }))

  useEffect(() => {
    // console.log(first)
    if (props.list.length) {
      const oldList = [...form.getFieldValue('list')]
      console.log(oldList)
      const newList = props.list.map((item) => ({ fileId: item.fileId }))
      form.setFieldsValue({
        list: [...oldList, ...newList],
      })
      const ids = props.list.map((item) => item.fileId)
      analyzeAllType(ids)
    }
  }, [props.list])

  return (
    <Form form={form} name="dynamic_form_complex" autoComplete="off">
      <Form.List name="list" initialValue={[{}]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, ...restField }) => (
              <Row className={cx('row-item')} key={key}>
                <Form.Item
                  {...restField}
                  style={{ display: 'none' }}
                  name={[name, 'fileId']}
                >
                  <Input />
                </Form.Item>

                <Col className={cx('col-item')} span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'replayFromAddr']}
                    rules={[
                      {
                        required: true,
                        message: '请填写',
                      },
                    ]}
                  >
                    <Input placeholder="直接填写或点击回函面单自动识别" />
                  </Form.Item>
                  <UploadPic
                    onSuccess={(file: any) =>
                      uploadSuccess(file, 'replayFromAddr', key)
                    }
                    onChange={uploadChange}
                  />
                </Col>
                <Col className={cx('col-item')} span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'companyName']}
                    rules={[
                      {
                        required: true,
                        message: '请填写',
                      },
                    ]}
                  >
                    <Input placeholder="直接填写或点击回函面单自动识别" />
                  </Form.Item>
                  <UploadPic
                    onSuccess={(file: any) =>
                      uploadSuccess(file, 'companyName', key)
                    }
                    onChange={uploadChange}
                  />
                </Col>
                <Col className={cx('col-item')} span={7}>
                  <Form.Item
                    {...restField}
                    name={[name, 'sendToAddr']}
                    rules={[
                      {
                        required: true,
                        message: 'Missing last name',
                      },
                    ]}
                  >
                    <Input placeholder="直接填写或点击回函面单自动识别" />
                  </Form.Item>
                  <a>
                    <EnvironmentOutlined style={{ marginRight: 4 }} />
                    选择地址
                  </a>
                </Col>
                <Col className={cx('col-item')} span={3}>
                  <div
                    className={cx('del-btn')}
                    onClick={() => handleDelete(remove, key)}
                  >
                    删除
                  </div>
                </Col>
              </Row>
            ))}
            <Form.Item>
              <Button
                className={cx('add-btn')}
                onClick={() => add()}
                type="dashed"
              >
                添加一条查询
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </Form>
  )
}

export default forwardRef(Index)
