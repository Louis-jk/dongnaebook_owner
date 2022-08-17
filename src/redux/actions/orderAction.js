import types from './types'

export function selectOrderTab () {
  return {
    type: types.SELECT_ORDER_TAB
  }
}

export function getNewOrder () {
  return {
    type: types.GET_NEW_ORDER_LIST
  }
}

export function updateNewOrder (data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_NEW_ORDER_LIST,
    payload: args !== null ? args : null
  }
}

export function updateNewOrderLimit (data) {

  return {
    type: types.SET_NEW_ORDER_LIMIT,
    payload: data
  }
}

export function initNewOrderLimit (data) {

  return {
    type: types.INIT_NEW_ORDER_LIMIT,
    payload: data
  }
}

export function getCheckOrder () {
  return {
    type: types.GET_CHECK_ORDER_LIST
  }
}

export function updateCheckOrder (data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_CHECK_ORDER_LIST,
    payload: args !== null ? args : null
  }
}

export function updateCheckOrderLimit (data) {

  return {
    type: types.SET_CHECK_ORDER_LIMIT,
    payload: data
  }
}

export function initCheckOrderLimit (data) {

  return {
    type: types.INIT_CHECK_ORDER_LIMIT,
    payload: data
  }
}

export function getDeliveryOrder () {
  return {
    type: types.GET_DELIVERY_ORDER_LIST
  }
}

export function updateDeliveryOrder (data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_DELIVERY_ORDER_LIST,
    payload: args !== null ? args : null
  }
}

export function updateDeliveryOrderLimit (data) {

  return {
    type: types.SET_DELIVERY_ORDER_LIMIT,
    payload: data
  }
}

export function initDeliveryOrderLimit (data) {

  return {
    type: types.INIT_DELIVERY_ORDER_LIMIT,
    payload: data
  }
}

export function getDoneOrder () {
  return {
    type: types.GET_DONE_ORDER_LIST
  }
}

export function updateDoneOrder (data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_DONE_ORDER_LIST,
    payload: args !== null ? args : null
  }
}

export function updateDoneOrderLimit (data) {

  return {
    type: types.SET_DONE_ORDER_LIMIT,
    payload: data
  }
}

export function initDoneOrderLimit (data) {

  return {
    type: types.INIT_DONE_ORDER_LIMIT,
    payload: data
  }
}
