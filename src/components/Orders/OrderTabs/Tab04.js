import React from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import * as orderAction from '../../../redux/actions/orderAction'
import OrdersAnimateLoading from '../../Loading/OrdersAnimateLoading'
import TabLayout from './TabLayout'

const Tab04 = props => {
  const { navigation } = props
  const { orderDone } = useSelector(state => state.order) // 처리완료 건
  const { orders, reflesh } = orderDone
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)
  const [firstInifinite, setFirstInfinite] = React.useState(false)
  const [orderCnt, setOrderCnt] = React.useState(0)

  const dispatch = useDispatch()

  React.useEffect(() => {
    setReflashing(reflesh)
  }, [reflesh])

  React.useEffect(() => {
    setOrderCnt(orders.length)
    return () => setOrderCnt(orders.length)
  }, [])

  function handleLoadMore () {
    if (Array.isArray(orders)) {
      if (isLoading) {
        setOrderCnt(orders.length)
      } else if (orders && orders.length === orderCnt && firstInifinite) {
        setOrderCnt(orders.length)
      } else {
        setFirstInfinite(true)
        setOrderCnt(orders.length)
        dispatch(orderAction.updateDoneOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getDoneOrder())
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <TabLayout
            index={4}
            orders={orders}
            navigation={navigation}
            onHandleRefresh={onHandleRefresh}
            handleLoadMore={handleLoadMore}
            refleshing={refleshing}
          />
        </View>}
    </>
  )
}

export default React.memo(Tab04)
