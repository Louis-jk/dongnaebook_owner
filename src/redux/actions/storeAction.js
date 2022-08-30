import types from './types'

export function updateStore (store) {
  return {
    type: types.UPDATE_STORE,
    storeUpdate: store
  }
}

export function selectStore (id, jumjuId, jumjuCode, mtStore, mtAddr) {
  return {
    type: types.SELECT_STORE,
    id: id,
    mt_jumju_id: jumjuId,
    mt_jumju_code: jumjuCode,
    mt_store: mtStore,
    mt_addr: mtAddr
  }
}
