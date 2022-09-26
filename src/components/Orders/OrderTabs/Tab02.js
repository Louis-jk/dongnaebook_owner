import React from 'react'
import { View } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import OrderRejectCancelModal from '../Modals/OrderRejectCancelModal'
import * as orderAction from '../../../redux/actions/orderAction'
import OrdersAnimateLoading from '../../Loading/OrdersAnimateLoading'
import TabLayout from './TabLayout'
import DeliveryConfirmationModal from '../Modals/DeliveryConfirmationModal'

const Tab02 = props => {
  const { navigation, getOrderListHandler } = props
  const { orderCheck } = useSelector(state => state.order) // 접수완료 건
  const { orders, reflesh } = orderCheck // 접수완료 건
  const [jumjuId, setJumjuId] = React.useState('') // 해당 점주 아이디
  const [jumjuCode, setJumjuCode] = React.useState('') // 해당 점주 코드
  const [isLoading, setLoading] = React.useState(false)
  const [firstInifinite, setFirstInfinite] = React.useState(false)
  const [orderCnt, setOrderCnt] = React.useState(0)
  const [orderType, setOrderType] = React.useState('') // 주문 Type

  const dispatch = useDispatch()

  // 주문 건
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [refleshing, setReflashing] = React.useState(false)

  React.useEffect(() => {
    // setLoading(reflesh)
    setReflashing(reflesh)
  }, [reflesh])

  React.useEffect(() => {
    setOrderCnt(orders.length)
    return () => setOrderCnt(orders.length)
  }, [])

  const [currentOrderType, setCurrentOrderType] = React.useState('')
  const [currentOrderId, setCurrentOrderId] = React.useState('')
  const [currentJumjuId, setCurrentJumjuId] = React.useState('')
  const [currentJumjuCode, setCurrentJumjuCode] = React.useState('')
  const [isDeliveryConfirmModalVisible, setDeliveryConfirmModalVisible] = React.useState(false)
  
  const closeModal = () => {
    setDeliveryConfirmModalVisible(false)
  }

  const deliveryOrderHandler = (type, orderId, jumjuId, jumjuCode) => {
    setCurrentOrderType(type)
    setCurrentOrderId(orderId)
    setCurrentJumjuId(jumjuId)
    setCurrentJumjuCode(jumjuCode)
    setDeliveryConfirmModalVisible(true)
  }

  // 주문 취소
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')

  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }
  const closeOrderRejectModal = () => {
    setModalVisible(false)
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
        dispatch(orderAction.updateCheckOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getCheckOrder())
    getOrderListHandler()
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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

          <DeliveryConfirmationModal
            isModalVisible={isDeliveryConfirmModalVisible}
            closeModal={closeModal}
            orderType={currentOrderType}
            oderId={currentOrderId}
            jumjuId={currentJumjuId}
            jumjuCode={currentJumjuCode}
            getOrderListHandler={getOrderListHandler}
            navigation={navigation}
          />

          <TabLayout
            index={2}
            orders={orders}
            navigation={navigation}
            deliveryOrderHandler={deliveryOrderHandler}
            toggleModal={toggleModal}
            isModalVisible={isModalVisible}
            onHandleRefresh={onHandleRefresh}
            handleLoadMore={handleLoadMore}
            refleshing={refleshing}
            setOrderId={setOrderId}
            setJumjuId={setJumjuId}
            setJumjuCode={setJumjuCode}
            setOrderType={setOrderType}
          />
        </View>}
    </>
  )
}

export default React.memo(Tab02)
