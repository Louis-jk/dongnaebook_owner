import NumberFormat from 'react-number-format';

// number type currency formatter
export const currencyFormatter = payload => {
  let result = new Intl.NumberFormat().format(payload);
  return result;
};

// string type currency formatter
export const stringCurrencyFormatter = payload => {
  // let intFormat = parseInt(payload);
  // let toFormat = new Intl.NumberFormat().format(intFormat);
  // let result = toFormat.toString();
  // let result = payload.replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ',');
  let result = payload.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  // let result = payload.replace('', ',');
  return result;
};
