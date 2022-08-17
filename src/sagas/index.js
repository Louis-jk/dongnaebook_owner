import { put, takeLatest, all, select, call, takeEvery } from 'redux-saga/effects'
import Api from '../Api'

export const getLoginObject = (state) => state.login
export const getOrderObject = (state) => state.order

// 주문 리스트 fetch
function * fetchOrders () {
  const loginInfo = yield select(getLoginObject)  
  const {selectOrderTab, orderNew, orderCheck, orderDelivery, orderDone} = yield select(getOrderObject)
  const {limit: newOrderLimit} = orderNew
  const {limit: checkOrderLimit} = orderCheck
  const {limit: deliveryOrderLimit} = orderDelivery
  const {limit: doneOrderLimit} = orderDone

  const param = {
    encodeJson: true,
    item_count: 0,
    limit_count: selectOrderTab === 0 ? newOrderLimit : selectOrderTab === 1 ? checkOrderLimit : selectOrderTab === 2 ? deliveryOrderLimit : selectOrderTab === 3 ? doneOrderLimit : 5,
    jumju_id: loginInfo.mt_id,
    jumju_code: loginInfo.mt_jumju_code,
    od_process_status: selectOrderTab === 0 ? '신규주문' : selectOrderTab === 1 ? '접수완료' : selectOrderTab === 2 ? '배달중' : selectOrderTab === 3 ? '배달완료' : '신규주문'
  }

  let newOrderArr = []

  yield Api.send('store_order_list', param, args => {
    // const resultItem = args.resultItem
    const arrItems = args.arrItems
    
    newOrderArr = arrItems
  }
  )


  if(selectOrderTab === 0) {
      yield put({ type: 'UPDATE_NEW_ORDER_LIST', payload: newOrderArr })
  }

  if(selectOrderTab === 1) {
    yield put({ type: 'UPDATE_CHECK_ORDER_LIST', payload: newOrderArr })
  }

  if(selectOrderTab === 2) {
    yield put({ type: 'UPDATE_DELIVERY_ORDER_LIST', payload: newOrderArr })
  }

  if(selectOrderTab === 3) {
    yield put({ type: 'UPDATE_DONE_ORDER_LIST', payload: newOrderArr })
  }
}

function * actionWatcher () {
  yield takeLatest('GET_NEW_ORDER_LIST', fetchOrders)
  yield takeLatest('GET_CHECK_ORDER_LIST', fetchOrders)
  yield takeLatest('GET_DELIVERY_ORDER_LIST', fetchOrders)
  yield takeLatest('GET_DONE_ORDER_LIST', fetchOrders)
  yield takeLatest('SET_NEW_ORDER_LIMIT', fetchOrders)
}

export default function * rootSaga () {
  yield all([
    actionWatcher()
  ])
}
