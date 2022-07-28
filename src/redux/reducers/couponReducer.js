import types from "../actions/types"

const defaultState = {
  coupons: [],
}

export default coupon = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_COUPON_LIST:
      return {
        coupons: action.coupon,
      }
    default:
      return state
  }
}
