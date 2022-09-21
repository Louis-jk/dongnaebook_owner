import types from "../actions/types"

const defaultState = {
  isNeedNewVersion: false,
  updateShortUrl: ''
}

export default versionCheck = (state = defaultState, action) => {
  // For Debugger
  console.log('ver reducer action', action);

  switch (action.type) {
    case types.UPDATE_VERSION_CHECK:
      return {
        ...state,
        isNeedNewVersion: action.payload
      }
    case types.UPDATE_STORE_URL:
      return {
        ...state,
        updateShortUrl: action.payload
      }
    default:
      return state
  }
}
