import types from '../actions/types'

const defaultState = {
  selectOrderTab: 0,
  newOrders: {
    reflesh: false, 
    orders: null,
    limit: 0 
  },
  checkOrders: {
    reflesh: false, 
    orders: null,
    limit: 0 
  },
  deliveryOrders: {
    reflesh: false, 
    orders: null,
    limit: 0 
  },
  doneOrders: {
    reflesh: false, 
    orders: null,
    limit: 0 
  }
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
        newOrders: {
          ...state.newOrders,
          reflesh: true
        }
      }
    case types.UPDATE_NEW_ORDER_LIST:
      console.log('action.payload ??', action.payload)
      return {
        ...state,
        newOrders: {
          ...state.newOrders,
          orders: action.payload !== null ? action.payload : null,
          reflesh: false
        }
      }
    case types.SET_NEW_ORDER_LIMIT:
      return {
        ...state,
        newOrders: {
          ...state.newOrders,
          limit: state.limit + action.payload
        }
      }
    case types.INIT_NEW_ORDER_LIMIT:
      return {
        ...state,
        newOrders: {
          ...state.newOrders,
          limit: action.payload
        }
      }
    case types.GET_CHECK_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 1,
        checkOrders: {
          ...state.checkOrders,
          reflesh: true
        }
      }
    case types.UPDATE_CHECK_ORDER_LIST:
      return {
        ...state,
        checkOrders: {
          ...state.checkOrders,
          orders: action.payload !== null ? action.payload : null,
          reflesh: false
        }
      }
    case types.GET_DELIVERY_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 2,
        deliveryOrders: {
          ...state.deliveryOrders,
          reflesh: true
        }
      }
    case types.UPDATE_DELIVERY_ORDER_LIST:
      return {
        ...state,
        deliveryOrders: {
          ...state.deliveryOrders,
          orders: action.payload !== null ? action.payload : null,
          reflesh: false
        }
      }
    case types.GET_DONE_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 3,
        doneOrders: {
          ...state.doneOrders,
          reflesh: true
        }
      }
    case types.UPDATE_DONE_ORDER_LIST:
      return {
        ...state,
        doneOrders: {
          ...state.doneOrders,
          orders: action.payload !== null ? action.payload : null,
          reflesh: false
        }
      }
    default:
      return state
  }
}
