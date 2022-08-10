import { put, takeLatest, all, select, call } from 'redux-saga/effects'
import Api from '../Api'

export const getLoginObject = (state) => state.login

// 주문 리스트 fetch
function * fetchOrders () {
  const loginInfo = yield select(getLoginObject)

  const param = {
    encodeJson: true,
    item_count: 0,
    limit_count: 10,
    jumju_id: loginInfo.mt_id,
    jumju_code: loginInfo.mt_jumju_code,
    od_process_status: '신규주문'
  }

  let newOrders = []

  yield Api.send('store_order_list', param, args => {
    // const resultItem = args.resultItem
    const arrItems = args.arrItems

    newOrders = arrItems
  }
  )

  yield put({ type: 'UPDATE_NEW_ORDER_LIST', payload: newOrders })
}

function * actionWatcher () {
  yield takeLatest('GET_NEW_ORDER_LIST', fetchOrders)
}

export default function * rootSaga () {
  yield all([
    actionWatcher()
  ])
}
