import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './counter'
import todoSlice from './todo'
import { IS_DEV } from '../constants'
export const store = configureStore({
  reducer: {
    [counterSlice.name]: counterSlice.reducer,
    [todoSlice.name]: todoSlice.reducer,
  },
  devTools: IS_DEV,
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
