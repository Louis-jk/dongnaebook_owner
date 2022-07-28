import types from "../actions/types"

const defaultState = {
  id: null, // add
  mt_id: null,
  mt_jumju_code: null,
  mt_name: null,
  mt_nickname: null,
  mt_hp: null,
  mt_email: null,
  mt_level: null,
  mt_gubun: null,
  mt_point: 0,
  mt_coupon: 0,
  mt_app_token: null,
  updateTime: null,
  fcmToken: null,
  mt_store: null,
  mt_ca_code: null, // add
  mb_ca_name: null, // add
  mt_addr: null, // add
  mt_lat: null, // add
  mt_lng: null, // add
}

export default login = (state = defaultState, action) => {
  // For Debugger
  // console.log(state);

  switch (action.type) {
    case types.UPDATE_LOGIN_CK:
      return {
        id: action.id, // add
        mt_id: action.mt_id,
        mt_jumju_code: action.mt_jumju_code,
        mt_name: action.mt_name,
        mt_nickname: action.mt_nickname,
        mt_hp: action.mt_hp,
        mt_email: action.mt_email,
        mt_level: action.mt_level,
        mt_gubun: action.mt_gubun,
        mt_point: action.mt_point,
        mt_coupon: action.mt_coupon,
        mt_app_token: action.mt_app_token,
        mt_store: action.mt_store,
        updateTime: action.updateTime,
        mt_ca_code: action.mt_ca_code, // add
        mb_ca_name: action.mb_ca_name, // add
        mt_addr: action.mt_addr, // add
        mt_lat: action.mt_lat, // add
        mt_lng: action.mt_lng, // add
      }
    case types.UPDATE_FCM_TOKEN:
      return {
        ...state,
        mt_app_token: action.mt_app_token,
      }
    case types.SELECT_STORE:
      return {
        ...state,
        mt_jumju_code: action.mt_jumju_code,
        mt_store: action.mt_store,
      }
    default:
      return state
  }
}
