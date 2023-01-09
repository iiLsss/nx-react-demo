import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getUserInfo } from '../../apis'
export interface UserState {
  username: string
  avatar: string
  isAdmin: boolean
  permissionIds: string[]
}

export const fetchUserInfo = createAsyncThunk(
  'user/info',
  async () => await getUserInfo()
)

const initialState: UserState = {
  username: '',
  avatar: '',
  isAdmin: false,
  permissionIds: ['1', '2'],
}

export const userSlice = createSlice({
  name: 'user',
  initialState: initialState,
  reducers: {},
  extraReducers(builder) {
    builder.addCase(fetchUserInfo.pending, (state, action) => {
      console.log(action)
      // state.avatar =
    })
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      console.log(action)
      // state.avatar =
    })
  },
})

export const userActions = userSlice.actions
export const userReducer = userSlice.reducer

export default userSlice
