import types from "./types"

export function updateStoreTime(data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_STORE_TIME,
    storeTime: args,
  }
}
