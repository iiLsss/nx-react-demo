import { fetchStore, storeAdapter, storeReducer } from './store.slice'

describe('store reducer', () => {
  it('should handle initial state', () => {
    const expected = storeAdapter.getInitialState({
      loadingStatus: 'not loaded',
      error: null,
    })

    expect(storeReducer(undefined, { type: '' })).toEqual(expected)
  })

  it('should handle fetchStores', () => {
    let state = storeReducer(undefined, fetchStore.pending(null, null))

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loading',
        error: null,
        entities: {},
      })
    )

    state = storeReducer(state, fetchStore.fulfilled([{ id: 1 }], null, null))

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'loaded',
        error: null,
        entities: { 1: { id: 1 } },
      })
    )

    state = storeReducer(
      state,
      fetchStore.rejected(new Error('Uh oh'), null, null)
    )

    expect(state).toEqual(
      expect.objectContaining({
        loadingStatus: 'error',
        error: 'Uh oh',
        entities: { 1: { id: 1 } },
      })
    )
  })
})
