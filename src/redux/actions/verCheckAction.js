import types from './types'

export function updateVersion (data) {
  
  return {
    type: types.UPDATE_VERSION_CHECK,
    payload: data
  }
}

export function updateStoreUrl (data) {
  
  return {
    type: types.UPDATE_STORE_URL,
    payload: data
  }
}

