import { createSlice } from '@reduxjs/toolkit'

export interface UserState {
  username: string
}

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    username: '',
  },
  reducers: {},
  // extraReducers(builder) {},
})

export const userAction = userSlice.actions
