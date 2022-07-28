import types from "./types"

export function updateClosedDay(data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_CLOSED_LIST,
    markedDay: args,
  }
}
