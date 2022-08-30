import types from '../actions/types'

const defaultState = {
  selectOrderTab: 0,
  orderNew: {
    reflesh: false,
    orders: [],
    limit: 5
  },
  orderCheck: {
    reflesh: false,
    orders: [],
    limit: 5
  },
  orderDelivery: {
    reflesh: false,
    orders: [],
    limit: 5
  },
  orderDone: {
    reflesh: false,
    orders: [],
    limit: 5
  },
  orderCancel: {
    reflesh: false,
    orders: [],
    limit: 5
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

    // 신규 주문
    case types.GET_NEW_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 0,
        orderNew: {
          ...state.orderNew,
          reflesh: true
        }
      }
    case types.UPDATE_NEW_ORDER_LIST:
      return {
        ...state,
        orderNew: {
          ...state.orderNew,
          orders: action.payload !== null ? action.payload : [],
          reflesh: false
        }
      }
    case types.SET_NEW_ORDER_LIMIT:
      return {
        ...state,
        orderNew: {
          ...state.orderNew,
          limit: state.orderNew.limit + action.payload
        }
      }
    case types.INIT_NEW_ORDER_LIMIT:
      return {
        ...state,
        orderNew: {
          ...state.orderNew,
          limit: action.payload
        }
      }

    // 접수완료
    case types.GET_CHECK_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 1,
        orderCheck: {
          ...state.orderCheck,
          reflesh: true
        }
      }
    case types.UPDATE_CHECK_ORDER_LIST:
      return {
        ...state,
        orderCheck: {
          ...state.orderCheck,
          orders: action.payload !== null ? action.payload : [],
          reflesh: false
        }
      }
    case types.SET_CHECK_ORDER_LIMIT:
      return {
        ...state,
        orderCheck: {
          ...state.orderCheck,
          limit: state.orderCheck.limit + action.payload
        }
      }
    case types.INIT_CHECK_ORDER_LIMIT:
      return {
        ...state,
        orderCheck: {
          ...state.orderCheck,
          limit: action.payload
        }
      }

    // 배달중
    case types.GET_DELIVERY_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 2,
        orderDelivery: {
          ...state.orderDelivery,
          reflesh: true
        }
      }
    case types.UPDATE_DELIVERY_ORDER_LIST:
      return {
        ...state,
        orderDelivery: {
          ...state.orderDelivery,
          orders: action.payload !== null ? action.payload : [],
          reflesh: false
        }
      }
    case types.SET_DELIVERY_ORDER_LIMIT:
      return {
        ...state,
        orderDelivery: {
          ...state.orderDelivery,
          limit: state.orderDelivery.limit + action.payload
        }
      }
    case types.INIT_DELIVERY_ORDER_LIMIT:
      return {
        ...state,
        orderDelivery: {
          ...state.orderDelivery,
          limit: action.payload
        }
      }

    // 처리완료
    case types.GET_DONE_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 3,
        orderDone: {
          ...state.orderDone,
          reflesh: true
        }
      }
    case types.UPDATE_DONE_ORDER_LIST:
      return {
        ...state,
        orderDone: {
          ...state.orderDone,
          orders: action.payload !== null ? action.payload : [],
          reflesh: false
        }
      }
    case types.SET_DONE_ORDER_LIMIT:
      return {
        ...state,
        orderDone: {
          ...state.orderDone,
          limit: state.orderDone.limit + action.payload
        }
      }
    case types.INIT_DONE_ORDER_LIMIT:
      return {
        ...state,
        orderDone: {
          ...state.orderDone,
          limit: action.payload
        }
      }

    // 주문 쉬소
    case types.GET_CANCEL_ORDER_LIST:
      return {
        ...state,
        selectOrderTab: 4,
        orderCancel: {
          ...state.orderCancel,
          reflesh: true
        }
      }
    case types.UPDATE_CANCEL_ORDER_LIST:
      return {
        ...state,
        orderCancel: {
          ...state.orderCancel,
          orders: action.payload !== null ? action.payload : [],
          reflesh: false
        }
      }
    case types.SET_CANCEL_ORDER_LIMIT:
      return {
        ...state,
        orderCancel: {
          ...state.orderCancel,
          limit: state.orderCancel.limit + action.payload
        }
      }
    case types.INIT_CANCEL_ORDER_LIMIT:
      return {
        ...state,
        orderCancel: {
          ...state.orderCancel,
          limit: action.payload
        }
      }
    default:
      return state
  }
}
