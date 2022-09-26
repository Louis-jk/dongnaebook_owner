import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import OrderCheckModal from '../Modals/OrderCheckModal'
import OrderRejectCancelModal from '../Modals/OrderRejectCancelModal'
import * as orderAction from '../../../redux/actions/orderAction'
import OrdersAnimateLoading from '../../Loading/OrdersAnimateLoading'
import TabLayout from './TabLayout'

const Tab01 = props => {
  const { navigation } = props
  const { orderNew } = useSelector(state => state.order) // 신규 주문 건
  const { orders, reflesh } = orderNew // 신규 주문 건
  const [isLoading, setLoading] = React.useState(false)
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [orderType, setOrderType] = React.useState('') // 주문 Type
  const [refleshing, setReflashing] = React.useState(false)
  const [jumjuId, setJumjuId] = React.useState('') // 해당 점주 아이디
  const [jumjuCode, setJumjuCode] = React.useState('') // 해당 점주 코드
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

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }
  const closeOrderRejectModal = () => {
    setModalVisible(false);
  }

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)
  const toggleOrderCheckModal = () => {
    setOrderCheckModalVisible(!isOrderCheckModalVisible)
  }
  const closeOrderCheckModal = () => {
    setOrderCheckModalVisible(false)
  }

  function handleLoadMore () {
    if (Array.isArray(orders)) {
      if (isLoading) {
        setOrderCnt(orders.length)
      } else if (orders && orders.length === orderCnt && firstInifinite) {
        setOrderCnt(orders.length)
      } else {
        setFirstInfinite(true)
        setOrderCnt(orders.length)
        dispatch(orderAction.updateNewOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getNewOrder())
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {orders && orders.length > 0 && (
            <OrderCheckModal
              isModalVisible={isOrderCheckModalVisible}
              closeModal={closeOrderCheckModal}
              oderId={orderId}
              orderType={orderType}
              navigation={navigation}
              jumjuId={jumjuId}
              jumjuCode={jumjuCode}
            />
          )}

          <OrderRejectCancelModal
            navigation={navigation}
            isModalVisible={isModalVisible}
            closeModal={closeOrderRejectModal}
            modalType={modalType}
            orderId={orderId}
            jumjuId={jumjuId}
            jumjuCode={jumjuCode}
            orderType={orderType}
          />

          <TabLayout
            index={1}
            orders={orders}
            navigation={navigation}
            toggleOrderCheckModal={toggleOrderCheckModal}
            toggleModal={toggleModal}
            onHandleRefresh={onHandleRefresh}
            handleLoadMore={handleLoadMore}
            refleshing={refleshing}
            setOrderId={setOrderId}
            setOrderType={setOrderType}
            setJumjuId={setJumjuId}
            setJumjuCode={setJumjuCode}
          />
        </View>}
    </>
  )
}

export default React.memo(Tab01)
