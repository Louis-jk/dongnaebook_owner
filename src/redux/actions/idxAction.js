import types from "./types"

export function updateIndex(idx, idx1, idx2) {
  return {
    type: types.UPDATE_INDEX,
    idx: idx,
    idx1: idx1,
    idx2: idx2,
  }
}
