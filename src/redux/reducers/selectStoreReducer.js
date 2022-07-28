import types from "../actions/types"

const defaultState = {
  store_id: null,
}

export default store = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.SELECT_STORE:
      return {
        store_id: action.select_store_id,
      }
    default:
      return state
  }
}
