import * as loginAction from './loginAction'
import * as idxAction from './idxAction'
import * as gpsAction from './gpsAction'
import * as sconfAction from './sconfAction'
import * as storeAction from './storeAction'
import * as couponAction from './couponAction'
import * as regularHolidayAction from './regularHolidayAction'
import * as storeTimeAction from './storeTimeAction'
import * as closedDayAction from './closedDayAction'
import * as orderAction from './orderAction'
import * as verCheckAction from './verCheckAction'

const ActionCreators = Object.assign(
  {},
  verCheckAction,
  loginAction,
  idxAction,
  gpsAction,
  sconfAction,
  storeAction,
  couponAction,
  regularHolidayAction,
  storeTimeAction,
  closedDayAction,
  orderAction
)

export default ActionCreators
