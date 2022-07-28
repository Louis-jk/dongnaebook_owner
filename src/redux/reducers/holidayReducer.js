import types from "../actions/types"

const defaultState = {
  st_yoil: null,
  st_yoil_txt: null,
  st_week: null,
}

export default regularHoliday = (state = defaultState, action) => {
  switch (action.type) {
    case types.UPDATE_REGULAR_HOLIDAY:
      return {
        st_yoil: action.st_yoil,
        st_yoil_txt: action.st_yoil_txt,
        st_week: action.st_week,
      }
    default:
      return state
  }
}
