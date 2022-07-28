import types from "../actions/types"

const defaultState = {
  markedDay: [],
}

export default closedDay = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_CLOSED_LIST:
      return {
        markedDay: action.markedDay,
      }
    default:
      return state
  }
}
