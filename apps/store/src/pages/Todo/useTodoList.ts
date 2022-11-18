import { useState } from 'react'

export type TodoItemType = {
  id: number
  todo: string
  isFinished: boolean
}

const useTodoList = (initialValue: TodoItemType[]) => {
  const [list, setList] = useState(initialValue)

  const changeTodoItemStatus = (data: TodoItemType) => {
    const newList = list.map((item: TodoItemType) => {
      const obj = { ...item }
      if (obj.id === data.id) {
        obj.isFinished = !obj.isFinished
      }
      return obj
    })
    setList(newList)
  }

  const deleteTodoItem = (data: TodoItemType) => {
    const newList = list.filter((item) => item.id !== data.id)
    setList(newList)
  }

  const addTodoItem = (data: TodoItemType) => {
    setList([...list, data])
  }

  return {
    list,
    changeTodoItemStatus,
    deleteTodoItem,
    addTodoItem,
  }
}

export default useTodoList
