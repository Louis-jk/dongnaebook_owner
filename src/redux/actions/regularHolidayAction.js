import types from "./types"

export function updateRegularHoliday(data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_REGULAR_HOLIDAY,
    st_yoil: args.st_yoil,
    st_yoil_txt: args.st_yoil_txt,
    st_week: args.st_week,
  }
}
