import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Linking,
  Alert,
  BackHandler
} from 'react-native'
import { useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import Header from '../components/Headers/SetHeader'
import BaseStyle, { Primary } from '../styles/Base'
import OrderRejectCancelModal from '../components/OrderModals/OrderRejectCancelModal'
import Api from '../Api'
import OrderCheckModal from '../components/OrderModals/OrderCheckModal'
import * as orderAction from '../redux/actions/orderAction'
import AnimateLoading from '../components/AnimateLoading'
import cusToast from '../components/CusToast'
import DeliveryConfirmationModal from '../components/OrderModals/DeliveryConfirmationModal'

const OrderDetail = props => {
  const { navigation } = props

  const { od_id: orderId, od_time: orderTime, type, jumjuId, jumjuCode } = props.route.params
  const [detailStore, setDetailStore] = React.useState(null)
  const [detailOrder, setDetailOrder] = React.useState(null)
  const [detailProduct, setDetailProduct] = React.useState([])
  const [isLoading, setLoading] = React.useState(true)

  const dispatch = useDispatch()

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

  // console.log('====================================')
  // console.log('detailStore', detailStore)
  // console.log('detailOrder', detailOrder)
  // console.log('detailProduct', detailProduct)
  // console.log('====================================')

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')

  function toggleModal (payload) {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }

  // 제목 설정
  const [title, setTitle] = React.useState('')

  function setHeaderTitleHandler () {
    if (type === 'ready') {
      setTitle('신규주문')
    } else if (type === 'doing') {
      setTitle('접수완료')
    } else if (type === 'going') {
      setTitle('배달중')
    } else if (type === 'cancel') {
      setTitle('주문취소')
    } else {
      setTitle('처리완료')
    }
  }

  React.useEffect(() => {
    setHeaderTitleHandler()

    return () => setHeaderTitleHandler()
  }, [type])

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)
  const toggleOrderCheckModal = () => {
    setOrderCheckModalVisible(!isOrderCheckModalVisible)
  }

  // 주문 배달처리 후 리스트 갱신
  function getOrderListHandlerCheck () {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: '접수완료'
    }

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)))
      } else {
        dispatch(orderAction.updateCheckOrder(null))
      }
    })
  }

  // 주문 배달처리
  function sendDeliverHandler () {
    const param = {
      od_id: orderId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: detailOrder.od_type === '배달' ? '배달중' : '포장완료'
    }

    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem

      if (resultItem.result === 'Y') {
        getOrderListHandlerCheck()
        cusToast(`주문을 ${detailOrder.od_type === '배달' ? '배달' : '포장완료'} 처리하였습니다.`)
      } else {
        cusToast(`주문을 ${detailOrder.od_type === '배달' ? '배달' : '포장완료'} 처리중 오류가 발생하였습니다.\n다시 한번 시도해주세요.`)
      }

      setTimeout(() => {
        navigation.navigate('Home', { screen: 'Main' })
      }, 1500)
    })
  }

  const [isDeliveryConfirmModalVisible, setDeliveryConfirmModalVisible] = React.useState(false)

  const toggleDeliveryConfirmModal = () => {
    setDeliveryConfirmModalVisible(!isDeliveryConfirmModalVisible)
  }

  function deliveryOrderHandler () {
    setDeliveryConfirmModalVisible(true)
  }

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title={title} type='default' />
          {/* <StatusMenu navigation={navigation} /> */}

          {detailStore && detailOrder && detailProduct && (
            <>
              {/* 접수 완료시 모달 */}
              <OrderCheckModal
                isModalVisible={isOrderCheckModalVisible}
                toggleModal={toggleOrderCheckModal}
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
                toggleModal={toggleDeliveryConfirmModal}
                orderType={detailOrder.od_type}
                oderId={orderId}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
                navigation={navigation}
              />
              {/* // 배달 | 포장 처리 모달 */}

              {/* 주문 취소/거부 모달 */}
              <OrderRejectCancelModal
                navigation={navigation}
                isModalVisible={isModalVisible}
                toggleModal={toggleModal}
                modalType={modalType}
                od_id={orderId}
                jumjuId={jumjuId}
                jumjuCode={jumjuCode}
              />
              {/* // 주문 취소/거부 모달 */}

              {/* 주문 방식 */}
              <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv15, backgroundColor: detailOrder.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02 }}>
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

              <ScrollView showsVerticalScrollIndicator={false}>

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
                            backgroundColor: Primary.PointColor03,
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
                      <View style={{ height: 1, width: '100%', backgroundColor: '#ececec' }} />
                    </>
                  )}
                  {/* // 취소건 일 때 취소 사유 */}

                  {/* 기본 정보 리스트 */}
                  <View style={{ ...BaseStyle.mv15, marginTop: type === 'cancel' ? 15 : 0 }}>
                    {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15}}>기본 정보</Text> */}
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                      주문 매장
                    </Text>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          상호명
                        </Text>
                      </View>
                      <View style={{ width: '65%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_333,
                            ...BaseStyle.lh24,
                            textAlign: 'right'
                          }}
                        >
                          {detailStore.mb_company}
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>주문시간</Text>
                      </View>
                      <View style={{ width: '65%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, textAlign: 'right' }}>
                          {moment(orderTime).format('YYYY년 M월 D일, HH시 mm분')}
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>주문방법</Text>
                      </View>
                      <View style={{ width: '65%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, textAlign: 'right' }}>
                          {detailOrder.od_type} 주문
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* // 기본 정보 리스트 */}

                  <View style={{ height: 1, width: '100%', backgroundColor: '#ececec' }} />

                  {/* 배달 정보 리스트 */}
                  <View style={{ ...BaseStyle.mv15 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                      {detailOrder.od_type} 정보
                    </Text>
                    {detailOrder.od_type === '배달' &&
                      <View
                        style={{
                          ...BaseStyle.container3,
                          justifyContent: 'space-between',
                          ...BaseStyle.mb10
                        }}
                      >
                        <View style={{ width: '30%' }}>
                          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>배달주소</Text>
                        </View>
                        <View style={{ marginTop: -2, width: '65%' }}>
                          <View style={{ ...BaseStyle.mb10 }}>
                            <Text
                              style={{
                                ...BaseStyle.ko14,
                                ...BaseStyle.font_333,
                                ...BaseStyle.lh24,
                                textAlign: 'right'
                              }}
                            >
                              {`${detailOrder.order_addr1} ${detailOrder.order_addr3 !== '' ? detailOrder.order_addr3 : ''}`}
                            </Text>
                            {/* <Text
                              style={{
                                ...BaseStyle.ko14,
                                ...BaseStyle.font_333,
                                ...BaseStyle.lh17,
                                textAlign: 'right'
                              }}
                            >
                              {`${detailOrder.order_addr3}`}
                            </Text> */}
                          </View>
                          {detailOrder.od_addr_jibeon !== '' &&
                            <View style={{ ...BaseStyle.mb10 }}>
                              <Text
                                style={{
                                  ...BaseStyle.ko14,
                                  ...BaseStyle.font_333,
                                  ...BaseStyle.lh17,
                                  textAlign: 'right'
                                }}
                              >
                                {`${detailOrder.od_addr_jibeon}`}
                              </Text>
                            </View>}
                        </View>
                      </View>}
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>전화번호</Text>
                      </View>
                      <TouchableOpacity
                        activeOpacity={1}
                        style={{ width: '65%' }}
                        onPress={() => {
                          Alert.alert('주문자에게 전화를 거시겠습니까?', '', [
                            {
                              text: '전화걸기',
                              onPress: () => Linking.openURL(`tel: ${detailOrder.order_hp}`)
                            },
                            {
                              text: '취소'
                            }
                          ])
                        }}
                      >
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, textAlign: 'right' }}>
                          {Api.phoneFomatter(detailOrder.order_hp)}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* // 배달 정보 리스트 */}

                  <View style={{ height: 1, width: '100%', backgroundColor: '#ececec' }} />

                  {/* 메뉴 정보 리스트 */}
                  <View style={{ ...BaseStyle.mv15 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                      메뉴 정보
                    </Text>

                    {detailProduct.length > 0 &&
                  detailProduct.map((menu, index) => (
                    <View
                      key={index}
                      activeOpacity={1}
                      style={{
                        borderWidth: 1,
                        borderColor: '#E3E3E3',
                        borderRadius: 5,
                        ...BaseStyle.ph15,
                        ...BaseStyle.pv15,
                        ...BaseStyle.mb10
                      }}
                    >
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          ...BaseStyle.mb7
                        }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            ...BaseStyle.ko16,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr10,
                            ...BaseStyle.mb7
                          }}
                        >
                          {menu.it_name}
                        </Text>
                        <Text
                          style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.mb7 }}
                        >
                          {Api.comma(menu.sum_price)}원
                        </Text>
                      </View>
                      <View
                        style={{
                          marginBottom:
                            menu.cart_add_option && menu.cart_add_option.length > 0 ? 10 : 0
                        }}
                      >
                        {menu.cart_option &&
                          menu.cart_option.length > 0 &&
                          menu.cart_option.map((defaultOption, key) => (
                            <View
                              key={`defaultOption-${key}`}
                              style={{
                                marginBottom:
                                  key === menu.cart_option.length - 1 &&
                                  menu.cart_add_option &&
                                  menu.cart_add_option.length === 0
                                    ? 0
                                    : 10
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',
                                  ...BaseStyle.mb7,
                                  flexWrap: 'wrap'
                                }}
                              >
                                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                                <Text
                                  style={{
                                    ...BaseStyle.ko14,
                                    ...BaseStyle.font_222
                                    // backgroundColor: Primary.PointColor01,
                                    // color: '#222',
                                  }}
                                >
                                  기본옵션 : {defaultOption.ct_option}
                                </Text>
                              </View>
                              <View
                                style={{
                                  flexDirection: 'row',
                                  justifyContent: 'flex-start',
                                  alignItems: 'flex-start',
                                  ...BaseStyle.mb3,
                                  flexWrap: 'wrap'
                                }}
                              >
                                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>
                                  옵션금액 : {Api.comma(defaultOption.io_price)}원
                                </Text>
                              </View>
                            </View>
                          ))}
                      </View>
                      {menu.cart_add_option &&
                        menu.cart_add_option.length > 0 &&
                        menu.cart_add_option.map((addOption, key) => (
                          <View
                            key={`addOption-${key}`}
                            style={{
                              marginBottom: key === menu.cart_add_option.length - 1 ? 0 : 10
                            }}
                          >
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                ...BaseStyle.mb3,
                                flexWrap: 'wrap'
                              }}
                            >
                              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>
                                추가옵션 : {addOption.ct_option}
                              </Text>
                            </View>
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'flex-start',
                                ...BaseStyle.mb3,
                                flexWrap: 'wrap'
                              }}
                            >
                              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>
                                옵션금액 : {Api.comma(addOption.io_price)}원
                              </Text>
                            </View>
                          </View>
                        ))}
                    </View>
                  ))}
                  </View>
                  {/* // 메뉴 정보 리스트 */}

                  <View style={{ height: 1, width: '100%', backgroundColor: '#ececec' }} />

                  {/* 요청사항 리스트 */}
                  <View style={{ ...BaseStyle.mv15 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                      요청사항
                    </Text>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          사장님께
                        </Text>
                      </View>
                      <View style={{ width: '65%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_333,
                            ...BaseStyle.lh24,
                            textAlign: 'right'
                          }}
                        >
                          {detailOrder.order_seller ? detailOrder.order_seller : '요청사항이 없습니다.'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '30%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_222,
                            ...BaseStyle.lh17
                          }}
                        >
                          배달기사님께
                        </Text>
                      </View>
                      <View style={{ width: '65%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_333,
                            ...BaseStyle.lh24,
                            textAlign: 'right'
                          }}
                        >
                          {detailOrder.order_officer
                            ? detailOrder.order_officer
                            : '요청사항이 없습니다.'}
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_222,
                            ...BaseStyle.lh24
                          }}
                        >
                          일회용 수저, 포크 유무
                        </Text>
                      </View>
                      <View style={{ width: '45%' }}>
                        <Text
                          style={{
                            ...BaseStyle.ko14,
                            ...BaseStyle.font_333,
                            ...BaseStyle.lh24,
                            textAlign: 'right'
                          }}
                        >
                          {detailOrder.od_no_spoon == '1' ? '필요없음' : '필요함'}
                        </Text>
                      </View>
                    </View>
                  </View>
                  {/* // 요청사항 리스트 */}

                  <View style={{ height: 1, width: '100%', backgroundColor: '#ececec' }} />

                  {/* 결제정보 리스트 */}
                  <View
                    style={{
                      // borderWidth: 1,
                      // borderColor: '#E3E3E3',
                      borderRadius: 5,
                      backgroundColor: '#F9F8FB',
                      ...BaseStyle.pv20,
                      ...BaseStyle.ph15,
                      ...BaseStyle.mt20,
                      ...BaseStyle.mb15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                      결제정보
                    </Text>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          총 주문금액
                        </Text>
                      </View>
                      <View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, ...BaseStyle.lh17 }}>
                          {Api.comma(detailOrder.odder_cart_price)} 원
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          배달팁
                        </Text>
                      </View>
                      <View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, ...BaseStyle.lh17 }}>
                          {Api.comma(detailOrder.order_cost)} 원
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          동네북 포인트
                        </Text>
                      </View>
                      <View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, ...BaseStyle.lh17 }}>
                          {Api.comma(detailOrder.order_point)} p
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          동네북 쿠폰 할인
                        </Text>
                      </View>
                      <View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, ...BaseStyle.lh17 }}>
                          {Api.comma(detailOrder.order_coupon_ohjoo)} 원
                        </Text>
                      </View>
                    </View>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ width: '50%' }}>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.lh17 }}>
                          상점 쿠폰 할인
                        </Text>
                      </View>
                      <View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, ...BaseStyle.lh17 }}>
                          {Api.comma(detailOrder.order_coupon_store)} 원
                        </Text>
                      </View>
                    </View>
                    <View
                      style={{
                        height: 1,
                        width: '100%',
                        backgroundColor: '#E3E3E3',
                        ...BaseStyle.mb20
                      }}
                    />
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>총 결제금액</Text>
                      <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>
                        {Api.comma(detailOrder.order_sumprice)} 원
                      </Text>
                    </View>
                    <View style={{ ...BaseStyle.container5 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>결제방법</Text>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>
                        {detailOrder.od_settle_case}
                      </Text>
                    </View>
                  </View>
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
                    onPress={toggleOrderCheckModal}
                    style={{
                      backgroundColor: detailOrder.od_type === '배달' ? '#20ABC8' : Primary.PointColor02,
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
                      backgroundColor: detailOrder.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02,
                      width: '50%',
                      justifyContent: 'center',
                      alignItems: 'center',
                      ...BaseStyle.pv15
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>
                      {detailOrder.od_type === '배달' ? '배달처리' : '포장완료'}
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
