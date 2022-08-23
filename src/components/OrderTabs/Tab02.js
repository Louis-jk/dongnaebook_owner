import React from 'react'
import { View, Alert } from 'react-native'
import { useDispatch, useSelector } from 'react-redux'
import Api from '../../Api'
import OrderRejectCancelModal from '../OrderRejectCancelModal'
import cusToast from '../CusToast'
import * as orderAction from '../../redux/actions/orderAction'
import OrdersAnimateLoading from '../OrdersAnimateLoading'
import TabLayout from './TabLayout'

const Tab02 = props => {
  const { navigation, getOrderListHandler } = props
  const { orderCheck } = useSelector(state => state.order) // 접수완료 건
  const { orders, reflesh } = orderCheck // 접수완료 건
  const [jumjuId, setJumjuId] = React.useState('') // 해당 점주 아이디
  const [jumjuCode, setJumjuCode] = React.useState('') // 해당 점주 코드
  const [isLoading, setLoading] = React.useState(false)
  const [firstInifinite, setFirstInfinite] = React.useState(false)
  const [orderCnt, setOrderCnt] = React.useState(0)

  const dispatch = useDispatch()

  // 주문 건
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [refleshing, setReflashing] = React.useState(false)

  React.useEffect(() => {
    setLoading(reflesh)
    setReflashing(reflesh)
  }, [reflesh])

  React.useEffect(() => {
    setOrderCnt(orders.length)
    return () => setOrderCnt(orders.length)
  }, [])

  // 주문 배달처리
  const sendDeliverHandler = (type, odId, jumjuId, jumjuCode) => {
    const param = {
      od_id: odId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: type === '배달' ? '배달중' : '포장완료'
    }

    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem

      if (resultItem.result === 'Y') {
        getOrderListHandler(1)
        cusToast(`주문을 ${type === '배달' ? '배달' : '포장완료'} 처리하였습니다.`)
      } else {
        getOrderListHandler(1)
        cusToast(`주문 ${type === '배달' ? '배달' : '포장완료'} 처리중 오류가 발생하였습니다.\n다시 한번 시도해주세요.`)
      }

      setTimeout(() => {
        navigation.navigate('Home', { screen: 'Main' })
      }, 1500)
    })
  }

  const deliveryOrderHandler = (type, orderId, jumjuId, jumjuCode) => {
    if (type === '배달') {
      Alert.alert('주문을 배달 처리하시겠습니까?', '', [
        {
          text: '네 배달처리',
          onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode)
        },
        {
          text: '아니요'
        }
      ])
    } else {
      Alert.alert('주문을 포장완료 처리하시겠습니까?', '', [
        {
          text: '네 포장완료',
          onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode)
        },
        {
          text: '아니요'
        }
      ])
    }
  }

  // 주문 취소
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')

  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
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
            toggleModal={toggleModal}
            modalType={modalType}
            od_id={orderId}
            jumjuId={jumjuId}
            jumjuCode={jumjuCode}
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
          />
        </View>}
    </>
  )
}

export default React.memo(Tab02)
