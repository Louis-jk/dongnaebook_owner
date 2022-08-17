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
