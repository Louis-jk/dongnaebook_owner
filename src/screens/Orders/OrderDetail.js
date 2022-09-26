import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  BackHandler
} from 'react-native'
import moment from 'moment'
import 'moment/locale/ko'
import Header from '../../components/Headers/SetHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import OrderRejectCancelModal from '../../components/Orders/Modals/OrderRejectCancelModal'
import Api from '../../Api'
import OrderCheckModal from '../../components/Orders/Modals/OrderCheckModal'
import AnimateLoading from '../../components/Loading/AnimateLoading'
import cusToast from '../../components/CusToast'
import DeliveryConfirmationModal from '../../components/Orders/Modals/DeliveryConfirmationModal'
import DeliveryCompleteModal from '../../components/Orders/Modals/DeliveryCompleteModal'
import Steps from '../../data/order/steps'
import Types from '../../data/order/types'
import OrderedStore from '../../components/Orders/Details/OrderedStore'
import OrderedInfo from '../../components/Orders/Details/OrderedInfo'
import OrderedMenus from '../../components/Orders/Details/OrderedMenus'
import OrderRequest from '../../components/Orders/Details/OrderRequest'
import OrderPaymentInfo from '../../components/Orders/Details/OrderPaymentInfo'
import Divider from '../../components/Divider'

const OrderDetail = props => {
  const { navigation } = props

  const { od_id: orderId, od_time: orderTime, type, jumjuId, jumjuCode } = props.route.params
  const [detailStore, setDetailStore] = React.useState(null)
  const [detailOrder, setDetailOrder] = React.useState(null)
  const [detailProduct, setDetailProduct] = React.useState([])
  const [isLoading, setLoading] = React.useState(true)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  function getOrderDetailHandler () {
    const param = {
      encodeJson: true,
      od_id: orderId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode
    }

    Api.send('store_order_detail', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      // console.log('store_order_detail', arrItems)

      if (resultItem.result === 'Y') {
        setDetailStore(arrItems.store)
        setDetailOrder(arrItems.order)
        setDetailProduct(arrItems.orderDetail)
      } else {
        cusToast('데이터를 받아오는데 오류가 발생하였습니다.\n관리자에게 문의해주세요')
      }

      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getOrderDetailHandler()
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')

  function toggleModal (payload) {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }
  const closeOrderRejectModal = () => {
    setModalVisible(false)
  }

  // 제목 설정
  const [title, setTitle] = React.useState('')

  function setHeaderTitleHandler () {
    if (type === 'ready') {
      setTitle(Steps[0])
    }

    if (type === 'doing') {
      setTitle(Steps[1])
    }

    if (type === 'going') {
      setTitle(Steps[2])
    }

    if (type === 'cancel') {
      setTitle(Steps[4])
    }

    if (type === 'done') {
      setTitle(Steps[3])
    }
  }

  React.useEffect(() => {
    setHeaderTitleHandler()

    return () => setHeaderTitleHandler()
  }, [type])

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)  
  const openOrderCheckModal = () => {
    setOrderCheckModalVisible(true)
  }
  const closeOrderCheckModal = () => {
    setOrderCheckModalVisible(false)
  }

  // 배달처리 모달 핸들러
  const [isDeliveryConfirmModalVisible, setDeliveryConfirmModalVisible] = React.useState(false)
  const closeDeliveryConfirmModal = () => {
    setDeliveryConfirmModalVisible(false)
  }

  function deliveryOrderHandler () {
    setDeliveryConfirmModalVisible(true)
  }

  // 배달완료 처리 모달 핸들러
  const [isDeliveryCompleteModalVisible, setDeliveryCompleteModalVisible] = React.useState(false)  
  const closeDeliveryCompleteModal = () => {
    setDeliveryCompleteModalVisible(false)
  }

  function deliveryCompleteHandler () {
    setDeliveryCompleteModalVisible(true)
  }

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title={title} type='default' />

          {detailStore && detailOrder && detailProduct && (
            <>
              {/* 접수 완료시 모달 */}
              <OrderCheckModal
                isModalVisible={isOrderCheckModalVisible}
                closeModal={closeOrderCheckModal}
                oderId={orderId}
                orderType={detailOrder.od_type}
                navigation={navigation}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
              />
              {/* // 접수 완료시 모달 */}

              {/* 배달 | 포장 처리 모달 */}
              <DeliveryConfirmationModal
                isModalVisible={isDeliveryConfirmModalVisible}
                closeModal={closeDeliveryConfirmModal}
                orderType={detailOrder.od_type}
                oderId={orderId}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
                navigation={navigation}
              />
              {/* // 배달 | 포장 처리 모달 */}

              {/* 배달 완료 처리 모달 */}
              <DeliveryCompleteModal
                isModalVisible={isDeliveryCompleteModalVisible}
                closeModal={closeDeliveryCompleteModal}
                orderId={orderId}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
                navigation={navigation}
              />
              {/* // 배달 완료 처리 모달 */}

              {/* 주문 취소/거부 모달 */}
              <OrderRejectCancelModal
                navigation={navigation}
                isModalVisible={isModalVisible}
                closeModal={closeOrderRejectModal}
                modalType={modalType}
                orderId={orderId}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
                orderType={detailOrder.od_type}
              />
              {/* // 주문 취소/거부 모달 */}

              {/* 주문 방식 */}
              <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv15, backgroundColor: detailOrder.od_type === Types[0].text ? Types[0].color : detailOrder.od_type === Types[1].text ? Types[1].color : Types[2].color }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, color: '#fff' }}>{detailOrder.od_type} 주문</Text>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>{moment(orderTime).format('YYYY년 M월 D일, HH시 mm분')}</Text>
              </View>
              {/* //주문 방식 */}

              {/* 주문 번호 */}
              <View
                style={{
                  ...BaseStyle.container5,
                  ...BaseStyle.pv15,
                  ...BaseStyle.ph20,
                  borderRadius: 5,
                  backgroundColor: '#F9F8FB'
                }}
              >
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>주문번호</Text>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>
                  {detailOrder.order_id}
                </Text>
              </View>
              {/* // 주문 번호 */}

              <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

                <View style={{ ...BaseStyle.ph20, ...BaseStyle.mt20 }}>

                  {/* 취소건 일 때 취소 사유 */}
                  {type === 'cancel' && (
                    <>
                      <View style={{ ...BaseStyle.mb15 }}>
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                          취소 사유
                        </Text>
                        <View
                          style={{
                            ...BaseStyle.pv15,
                            ...BaseStyle.ph15,
                            backgroundColor: '#F9F8FB',
                            borderRadius: 5
                          }}
                        >
                          <Text
                            style={{
                              ...BaseStyle.ko14,
                              ...BaseStyle.font_333,
                              ...BaseStyle.lh17
                            }}
                          >
                            {detailOrder.od_cancle_memo}
                          </Text>
                        </View>
                      </View>
                      <Divider />
                    </>
                  )}
                  {/* // 취소건 일 때 취소 사유 */}

                  {/* 기본 정보 리스트 */}
                  <OrderedStore
                    type={type}
                    detailStore={detailStore}
                    orderTime={orderTime}
                    detailOrder={detailOrder}
                  />
                  {/* // 기본 정보 리스트 */}

                  <Divider />

                  {/* 주문 타입 및 정보 리스트 */}
                  <OrderedInfo detailOrder={detailOrder} />
                  {/* // 주문 타입 및 정보 리스트 */}

                  <Divider />

                  {/* 메뉴 정보 리스트 */}
                  <OrderedMenus detailProduct={detailProduct} />
                  {/* // 메뉴 정보 리스트 */}

                  <Divider />

                  {/* 요청사항 리스트 */}
                  <OrderRequest detailOrder={detailOrder} />
                  {/* // 요청사항 리스트 */}

                  <Divider />

                  {/* 결제정보 리스트 */}
                  <OrderPaymentInfo detailOrder={detailOrder} />
                  {/* // 결제정보 리스트 */}
                </View>
              </ScrollView>

              {type === 'ready' && (
              // 접수중일 경우 출력
                <View style={{ ...BaseStyle.container, width: Dimensions.get('window').width }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => toggleModal('reject')}
                    style={{
                      backgroundColor: '#F1F1F1',
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14 }}>주문거부</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={openOrderCheckModal}
                    style={{
                      backgroundColor: detailOrder.od_type === Types[0].text ? Types[0].color : detailOrder.od_type === Types[1].text ? Types[1].color : Types[2].color,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text
                      style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.font_white }}
                    >
                      접수하기
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {type === 'doing' && (
              // 처리중일 경우 출력
                <View style={{ ...BaseStyle.container, width: Dimensions.get('window').width }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => toggleModal('cancel')}
                    style={{
                      backgroundColor: '#F1F1F1',
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14 }}>주문취소</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => deliveryOrderHandler()}
                    style={{
                      backgroundColor: detailOrder.od_type === Types[0].text ? Types[0].color : detailOrder.od_type === Types[1].text ? Types[1].color : Types[2].color,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>
                      {detailOrder.od_type === Types[0].text ? '배달처리' : detailOrder.od_type === Types[1].text ? '포장완료' : '식사완료'}
                    </Text>
                  </TouchableOpacity>
                </View>
              )}

              {type === 'going' && (
              // 처리중일 경우 출력
                <View style={{ ...BaseStyle.container, width: Dimensions.get('window').width }}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => deliveryCompleteHandler()}
                    style={{
                      backgroundColor: detailOrder.od_type === Types[0].text ? Types[0].color : detailOrder.od_type === Types[1].text ? Types[1].color : Types[2].color,
                      width: '100%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>
                      배달완료처리
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}
        </View>}
    </>
  )
}

export default OrderDetail
