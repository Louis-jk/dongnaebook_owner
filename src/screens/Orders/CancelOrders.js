import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Header from '../../components/Headers/SubHeader'
import * as orderAction from '../../redux/actions/orderAction'
import OrdersAnimateLoading from '../../components/Loading/OrdersAnimateLoading'
import TabLayout from '../../components/Orders/OrderTabs/TabLayout'

const CancelOrders = props => {
  const { navigation } = props
  const { orderCancel } = useSelector(state => state.order) // 신규 주문 건
  const { orders, reflesh } = orderCancel
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(true)
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

  const getCancelListHandler = () => {
    dispatch(orderAction.initCancelOrderLimit(5))
    dispatch(orderAction.getCancelOrder())
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getCancelListHandler()
    })
    return unsubscribe
  }, [navigation])

  function handleLoadMore () {
    if (Array.isArray(orders)) {
      if (isLoading) {
        setOrderCnt(orders.length)
        return false
      } else if (orders && orders.length === orderCnt && firstInifinite) {
        setOrderCnt(orders.length)
        return false
      } else {
        setFirstInfinite(true)
        setOrderCnt(orders.length)
        dispatch(orderAction.updateCancelOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getCancelOrder())
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='주문취소내역' />

          <TabLayout
            index={5}
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

export default CancelOrders
