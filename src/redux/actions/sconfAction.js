import types from "./types"

export function updateSconf(
  aname,
  aemail,
  acallno,
  aaddress,
  aceo,
  abizname,
  abizelc,
  abizno,
  aprivacy,
  acustomer,
  abank_account,
  abank_date
) {
  return {
    type: types.UPDATE_SITE,
    aname: aname,
    aemail: aemail,
    acallno: acallno,
    aaddress: aaddress,
    aceo: aceo,
    abizname: abizname,
    abizelc: abizelc,
    abizno: abizno,
    aprivacy: aprivacy,
    acustomer: acustomer,
    abank_account: abank_account,
    abank_date: abank_date,
  }
}
