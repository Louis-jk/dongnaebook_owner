import React from 'react'
import { View } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import * as orderAction from '../../../redux/actions/orderAction'
import OrdersAnimateLoading from '../../Loading/OrdersAnimateLoading'
import TabLayout from './TabLayout'

const Tab03 = props => {
  const { navigation } = props
  const { orderDelivery } = useSelector(state => state.order) // 배달중인 주문건
  const { orders, reflesh } = orderDelivery
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)
  const [firstInifinite, setFirstInfinite] = React.useState(false)
  const [orderCnt, setOrderCnt] = React.useState(0)

  const dispatch = useDispatch()

  React.useEffect(() => {
    setLoading(reflesh)
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
        dispatch(orderAction.updateDeliveryOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getDeliveryOrder())
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

          <TabLayout
            index={3}
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

export default React.memo(Tab03)
