import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, Platform } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import OrderCheckModal from '../OrderCheckModal'
import OrderRejectCancelModal from '../OrderRejectCancelModal'
import OrderEmpty from './OrderEmpty'
import * as orderAction from '../../redux/actions/orderAction'
import OrdersAnimateLoading from '../OrdersAnimateLoading'

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
  const [count, setCount] = React.useState(0)
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

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)
  const toggleOrderCheckModal = () => {
    setOrderCheckModalVisible(!isOrderCheckModalVisible)
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

  /*
  offset 0, limit 10
  offset 11, limit 10
  offset 21, limit 10
  */

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getNewOrder())
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={index}>
        <View
          style={{
            backgroundColor: '#F8F8F8',
            width: '100%',
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10
          }}
        >
          <Text style={{ ...BaseStyle.ko14 }}>
            {moment(item.od_time).format('YYYY년 M월 D일 HH:mm')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container5, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>

          {/* 주문 정보 */}
          <TouchableOpacity
            activeOpacity={1}
            style={{ alignSelf: 'flex-start', flex: 3, paddingRight: 20 }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'ready',
                jumjuId: item.jumju_id,
                jumjuCode: item.jumju_code
              })}
          >
            {/* 회사명 */}
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
              <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }} numberOfLines={1}>
                {item.mb_company}
              </Text>
              <View
                style={{
                  ...BaseStyle.ph5,
                  ...BaseStyle.ml10,
                  borderRadius: 5,
                  backgroundColor:
                      item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02
                }}
              >
                <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_white, marginBottom: Platform.OS === 'ios' ? 2 : 0 }}>{item.od_type}</Text>
              </View>
            </View>
            {/* // 회사명 */}

            {/* 주문 메뉴명 */}
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
            {/* // 주문 메뉴명 */}

            {/* 결제방법 */}
            <View style={{ ...BaseStyle.container }}>
              <Text
                style={[
                  { ...BaseStyle.ko14 },
                  item.od_settle_case === '선결제' ? BaseStyle.font_blue : BaseStyle.font_pink
                ]}
              >
                {item.od_settle_case}
              </Text>
              <Text style={{ ...BaseStyle.ko14 }}> / </Text>
              <Text style={{ ...BaseStyle.ko14 }}>{Api.comma(item.od_receipt_price)}원</Text>
            </View>
            {/* // 결제방법 */}

            {/* 배달 주소 */}
            {item.od_type === '배달' &&
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt10, ...BaseStyle.mr20 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: '#999',
                    borderRadius: 25,
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: 25,
                    height: 25,
                    ...BaseStyle.mr5
                  }}
                >
                  <Image
                    source={require('../../images/ic_map.png')}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode='center'
                  />
                </View>
                <View>
                  <Text
                    style={{
                      ...BaseStyle.ko14,
                      ...BaseStyle.lh20
                    }}
                  >
                    {`${item.od_addr1} ${item.od_addr2}`}
                  </Text>
                  {item.od_addr3 !== '' && (
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                  )}
                  {item.od_addr_jibeon !== '' &&
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh17 }}>
                      {item.od_addr_jibeon}
                    </Text>}
                </View>
              </View>}
            {/* // 배달 주소 */}
          </TouchableOpacity>
          {/* // 주문 정보 */}

          {/* 접수, 주문거부 버튼 영역 */}
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id)
                setOrderType(item.od_type)
                setJumjuId(item.jumju_id)
                setJumjuCode(item.jumju_code)
                toggleOrderCheckModal()
              }}
              style={{
                backgroundColor: item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                ...BaseStyle.round05,
                ...BaseStyle.pv10,
                ...BaseStyle.mb5
              }}
            >
              <Text
                style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}
              >
                접수
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id)
                setJumjuId(item.jumju_id)
                setJumjuCode(item.jumju_code)
                toggleModal('reject')
              }}
              style={{
                ...BaseStyle.round05,
                ...BaseStyle.pv10,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 1,
                borderColor: '#E3E3E3',
                backgroundColor: '#fff'
              }}
            >
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}>
                주문거부
              </Text>
            </TouchableOpacity>
          </View>
          {/* // 접수, 주문거부 버튼 영역 */}

        </View>
      </View>
    )
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {orders && orders.length > 0 && (
            <OrderCheckModal
              isModalVisible={isOrderCheckModalVisible}
              toggleModal={toggleOrderCheckModal}
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
            toggleModal={toggleModal}
            modalType={modalType}
            od_id={orderId}
            jumjuId={jumjuId}
            jumjuCode={jumjuCode}
          />
          <FlatList
            data={orders}
            renderItem={renderRow}
            keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
            persistentScrollbar
            showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
            refreshing={refleshing}
            onRefresh={() => onHandleRefresh()}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.4}
            style={{ backgroundColor: '#fff', width: '100%' }}
            ListEmptyComponent={
              <OrderEmpty text='신규' />
          }
          />
        </View>}
    </>
  )
}

export default React.memo(Tab01)
