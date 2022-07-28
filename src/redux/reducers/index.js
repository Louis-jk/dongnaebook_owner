import { combineReducers } from 'redux';

import loginReducer from './loginReducer';
import indexReducer from './indexReducer';
import gpsReducer from './gpsReducer';
import sconfReducer from './sconfReducer';
import allStoreReducer from './allStoreReducer';
import selectStoreReducer from './selectStoreReducer';
import couponReducer from './couponReducer';
import holidayReducer from './holidayReducer';
import storeTimeReducer from './storeTimeReducer';
import closeDayReducer from './closeDayReducer';
import orderReducer from './orderReducer';

export default combineReducers({
  login: loginReducer,
  index: indexReducer,
  gps: gpsReducer,
  sconf: sconfReducer,
  store: allStoreReducer,
  slctStore: selectStoreReducer,
  coupon: couponReducer,
  regularHoliday: holidayReducer,
  storeTime: storeTimeReducer,
  closedDay: closeDayReducer,
  order: orderReducer,
});
