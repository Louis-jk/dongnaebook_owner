import types from './types';

export function alarmNewOrder(data) {
  return {
    type: types.TOGGLE_NEW_ORDER_LIST,
    payload: data => !data
  };
}

export function updateNewOrder(data) {
  const args = JSON.parse(data);
  console.log('args', args);
  return {
    type: types.UPDATE_NEW_ORDER_LIST,
    payload: args !== null ? args : null
  };
}

export function updateCheckOrder(data) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_CHECK_ORDER_LIST,
    payload: args !== null ? args : null
  };
}

export function updateDeliveryOrder(data) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_DELIVERY_ORDER_LIST,
    payload: args !== null ? args : null
  };
}

export function updateDoneOrder(data) {
  const args = JSON.parse(data);
  
  return {
    type: types.UPDATE_DONE_ORDER_LIST,
    payload: args !== null ? args : null
  };
}
