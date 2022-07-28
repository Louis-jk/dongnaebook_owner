import types from "./types"

export function updateLogin(data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_LOGIN_CK,
    id: args.id ? args.id : null, // add
    mt_id: args.mt_id,
    mt_jumju_code: args.mt_jumju_code,
    mt_name: args.mt_name,
    mt_nickname: args.mt_nickname,
    mt_hp: args.mt_hp,
    mt_email: args.mt_email,
    mt_level: args.mt_level,
    mt_gubun: args.mt_gubun,
    mt_point: args.mt_point,
    mt_coupon: args.mt_coupon,
    mt_app_token: args.mt_app_token,
    updateTime: args.updateTime,
    mt_store: args.mt_store,
    mt_ca_code: args.mt_ca_code ? args.mt_ca_code : null, // add
    mb_ca_name: args.mb_ca_name ? args.mb_ca_name : null, // add
    mt_addr: args.mt_addr ? args.mt_addr : null, // add
    mt_lat: args.mt_lat ? args.mt_lat : null, // add
    mt_lng: args.mt_lng ? args.mt_lng : null, // add
  }
}

export function updateToken(data) {
  const args = JSON.parse(data)

  return {
    type: types.UPDATE_FCM_TOKEN,
    mt_app_token: args,
  }
}
