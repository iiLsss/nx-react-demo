import { useState } from 'react'
import classnames from 'classnames/bind'
import { Input, List, Checkbox } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'
import { Button } from '@integrated-react-test/common-ui'
import style from './index.module.less'
import useInputState from './useInputState'
import useTodoList, { TodoItemType } from './useTodoList'
const cx = classnames.bind(style)

const data: TodoItemType[] = [
  {
    id: 1668667007120,
    todo: 'Racing car sprays burning fuel into crowd.',
    isFinished: false,
  },
  {
    id: 1668667007121,
    todo: 'Japanese princess to wed commoner.',
    isFinished: false,
  },
]

const Index = () => {
  const { list, addTodoItem, deleteTodoItem, changeTodoItemStatus } =
    useTodoList(data)
  const { value, onChange, onReset } = useInputState()

  const handleAdd = () => {
    addTodoItem({
      id: new Date().valueOf(),
      todo: value,
      isFinished: false,
    })
    onReset()
  }

  return (
    <div className={cx('wrap')}>
      <div className={cx('todo-wall')}>
        <div className={cx('todo-input')}>
          <Input onChange={onChange} value={value} />
          <Button onClick={handleAdd}>添加</Button>
        </div>
        <div className={cx('todo-list')}>
          <List size="small" bordered>
            {list.map((item) => {
              return (
                <List.Item key={item.id}>
                  <div className={cx(item.isFinished ? 'finish' : '')}>
                    {item.todo}
                  </div>
                  <div>
                    <Checkbox
                      checked={item.isFinished}
                      onChange={() => changeTodoItemStatus(item)}
                    />
                    <DeleteOutlined
                      onClick={() => deleteTodoItem(item)}
                      className={cx('icon-del')}
                    />
                  </div>
                </List.Item>
              )
            })}
          </List>
        </div>
      </div>
    </div>
  )
}
export default Index
