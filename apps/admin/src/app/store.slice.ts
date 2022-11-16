import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit'

export const STORE_FEATURE_KEY = 'store'

/*
 * Update these interfaces according to your requirements.
 */
export interface StoreEntity {
  id: number
}

export interface StoreState extends EntityState<StoreEntity> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error'
  error: string
}

export const storeAdapter = createEntityAdapter<StoreEntity>()

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(fetchStore())
 * }, [dispatch]);
 * ```
 */
export const fetchStore = createAsyncThunk(
  'store/fetchStatus',
  async (_, thunkAPI) => {
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getStores()`;
     * Right now we just return an empty array.
     */
    return Promise.resolve([])
  }
)

export const initialStoreState: StoreState = storeAdapter.getInitialState({
  loadingStatus: 'not loaded',
  error: null,
})

export const storeSlice = createSlice({
  name: STORE_FEATURE_KEY,
  initialState: initialStoreState,
  reducers: {
    add: storeAdapter.addOne,
    remove: storeAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStore.pending, (state: StoreState) => {
        state.loadingStatus = 'loading'
      })
      .addCase(
        fetchStore.fulfilled,
        (state: StoreState, action: PayloadAction<StoreEntity[]>) => {
          storeAdapter.setAll(state, action.payload)
          state.loadingStatus = 'loaded'
        }
      )
      .addCase(fetchStore.rejected, (state: StoreState, action) => {
        state.loadingStatus = 'error'
        state.error = action.error.message
      })
  },
})

/*
 * Export reducer for store configuration.
 */
export const storeReducer = storeSlice.reducer

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(storeActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const storeActions = storeSlice.actions

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllStore);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = storeAdapter.getSelectors()

export const getStoreState = (rootState: unknown): StoreState =>
  rootState[STORE_FEATURE_KEY]

export const selectAllStore = createSelector(getStoreState, selectAll)

export const selectStoreEntities = createSelector(getStoreState, selectEntities)
