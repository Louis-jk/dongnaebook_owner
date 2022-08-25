
// number type currency formatter
export const currencyFormatter = payload => {
  const result = new Intl.NumberFormat().format(payload)
  return result
}

// string type currency formatter
export const stringCurrencyFormatter = payload => {
  // let intFormat = parseInt(payload);
  // let toFormat = new Intl.NumberFormat().format(intFormat);
  // let result = toFormat.toString();
  // let result = payload.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  const result = payload.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  // let result = payload.replace('', ',');
  return result
}
