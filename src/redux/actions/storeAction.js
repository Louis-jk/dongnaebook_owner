import types from "./types"

export function updateStore(store) {
  return {
    type: types.UPDATE_STORE,
    storeUpdate: store,
  }
}

// export function selectStore(storeId, storeName) {
//   return {
//     type: types.SELECT_STORE,
//     selectStoreId: storeId,
//     selectStoreName: storeName,
//   };
// }

export function selectStore(id, mt_jumju_id, mt_jumju_code, mt_store, mt_addr) {
  return {
    type: types.SELECT_STORE,
    id: id,
    mt_jumju_id: mt_jumju_id,
    mt_jumju_code: mt_jumju_code,
    mt_store: mt_store,
    mt_addr: mt_addr,
  }
}
