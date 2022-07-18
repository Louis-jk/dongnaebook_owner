import types from '../actions/types';

const defaultState = {
  new_check: false,
  newOrder: null,
  checkOrder: null,
  deliveryOrder: null,
  doneOrder: null
};

export default order = (state = defaultState, action) => {
  // For Debugger
  
  switch (action.type) {
  case types.TOGGLE_NEW_ORDER_LIST:
    return {
      ...state,
      new_check: action.payload
    };
  case types.UPDATE_NEW_ORDER_LIST:
    return {
      ...state,
      newOrder: action.payload !== null ? action.payload : null
    };
  case types.UPDATE_CHECK_ORDER_LIST:
    return {
      ...state,
      checkOrder: action.payload !== null ? action.payload : null
    };
  case types.UPDATE_DELIVERY_ORDER_LIST:
    return {
      ...state,
      deliveryOrder: action.payload !== null ? action.payload : null
    };
  case types.UPDATE_DONE_ORDER_LIST:
    return {
      ...state,
      doneOrder: action.payload !== null ? action.payload : null
    };
  default:
    return state;
  }
};
