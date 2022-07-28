import types from "../actions/types"

let defaultState = {
  aname: null,
  aemail: null,
  acallno: null,
  aaddress: null,
  aceo: null,
  abizname: null,
  abizelc: null,
  abizno: null,
  aprivacy: null,
  acustomer: null,
  abank_account: null,
  abank_date: null,
}

export default sconf = (state = defaultState, action) => {
  // For Debugger

  switch (action.type) {
    case types.UPDATE_SITE:
      return {
        aname: action.aname,
        aemail: action.aemail,
        acallno: action.acallno,
        aaddress: action.aaddress,
        aceo: action.aceo,
        abizname: action.abizname,
        abizelc: action.abizelc,
        abizno: action.abizno,
        aprivacy: action.aprivacy,
        acustomer: action.acustomer,
        abank_account: action.abank_account,
        abank_date: action.abank_date,
      }
    default:
      return state
  }
}
