import types from "../actions/types"

const defaultState = {
  storeTime: [],
}

export default storeTime = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_STORE_TIME:
      return {
        storeTime: action.storeTime,
      }
    default:
      return state
  }
}
