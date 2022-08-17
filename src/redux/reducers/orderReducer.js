import types from '../actions/types'

const defaultState = {
  selectOrderTab: 0,
  newOrderRefleshing: false,
  newOrder: null,
  checkOrderRefleshing: false,
  checkOrder: null,
  deliveryOrderRefleshing: false,
  deliveryOrder: null,
  doneOrderRefleshing: false,
  doneOrder: null
}

export default order = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.SELECT_ORDER_TAB:
      return {
        ...state,
        selectOrderTab: action.payload
      }
    case types.GET_NEW_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 0,
        newOrderRefleshing: true
      }
    case types.UPDATE_NEW_ORDER_LIST:
      return {
        ...state,
        newOrder: action.payload !== null ? action.payload : null,
        newOrderRefleshing: false
      }
    case types.GET_CHECK_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 1,
        checkOrderRefleshing: true
      }
    case types.UPDATE_CHECK_ORDER_LIST:
      return {
        ...state,
        checkOrder: action.payload !== null ? action.payload : null,
        checkOrderRefleshing: false
      }
    case types.GET_DELIVERY_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 2,
        deliveryOrderRefleshing: true
      }
    case types.UPDATE_DELIVERY_ORDER_LIST:
      return {
        ...state,
        deliveryOrder: action.payload !== null ? action.payload : null,
        deliveryOrderRefleshing: false
      }
    case types.GET_DONE_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 3,
        doneOrderRefleshing: true
      }
    case types.UPDATE_DONE_ORDER_LIST:
      return {
        ...state,
        doneOrder: action.payload !== null ? action.payload : null,
        doneOrderRefleshing: false
      }
    default:
      return state
  }
}
