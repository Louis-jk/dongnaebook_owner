import types from './types'

export function updateCoupon (data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_COUPON_LIST,
    coupon: args !== null ? args : null
  }
}
