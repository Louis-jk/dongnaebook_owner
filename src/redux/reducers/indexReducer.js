import types from "../actions/types"

const defaultState = {
  idx: "",
  idx1: "",
  idx2: "",
}

export default index = (state = defaultState, action) => {
  // For Debugger
  // console.log(state);

  switch (action.type) {
    case types.UPDATE_INDEX:
      return {
        idx: action.idx,
        idx1: action.idx1,
        idx2: action.idx2,
      }
    default:
      return state
  }
}
