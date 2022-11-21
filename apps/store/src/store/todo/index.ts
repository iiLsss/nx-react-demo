import { createSlice, PayloadAction, current } from '@reduxjs/toolkit'
import { TodoItemType } from '../../types/todo'

export interface TodoState {
  todoList: TodoItemType[]
}

const initialState: TodoState = {
  todoList: [],
}

export const todoSlice = createSlice({
  name: 'todo',
  initialState,
  reducers: {
    addTodoItem(state, action: PayloadAction<TodoItemType>) {
      console.log(state)
      console.log(current(state))
      state.todoList.push(action.payload)
    },
    deleteTodoItem(state, action: PayloadAction<number>) {
      state.todoList = state.todoList.filter(
        (item) => item.id !== action.payload
      )
    },
    changeItemStatus(state, action: PayloadAction<number>) {
      const todo = state.todoList.find((todo) => todo.id === action.payload)
      if (todo) {
        todo.isFinished = !todo.isFinished
      }
    },
  },
})

export const todoActions = todoSlice.actions
export const todoReducer = todoSlice.reducer

export default todoSlice
