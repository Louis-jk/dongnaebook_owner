import types from '../actions/types'

const defaultState = {
  allStore: [],
  selectedStore: {
    id: null,
    mt_jumju_id: null,
    mt_jumju_code: null,
    mt_store: null,
    mt_addr: null
  }
}

export default store = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_STORE:
      return {
        ...state,
        allStore: action.storeUpdate
        // allStore: [...new Set([...state.allStore, ...action.storeUpdate])],
      }
    case types.SELECT_STORE:
      return {
        ...state,
        selectedStore: {
          id: action.id,
          mt_jumju_id: action.mt_jumju_id,
          mt_jumju_code: action.mt_jumju_code,
          mt_store: action.mt_store,
          mt_addr: action.mt_addr
        }
      }
    default:
      return state
  }
}
