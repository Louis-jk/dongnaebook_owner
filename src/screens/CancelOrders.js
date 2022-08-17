import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import Header from '../components/SubHeader'
import Api from '../Api'
import BaseStyle, { Primary } from '../styles/Base'
import OrderEmpty from '../components/OrderTabs/OrderEmpty'
import * as orderAction from '../redux/actions/orderAction'
import OrdersAnimateLoading from '../components/OrdersAnimateLoading'

const CancelOrders = props => {
  const { navigation } = props
  const { mt_id: jumjuId, mt_jumju_code: jumjuCode } = useSelector(state => state.login)
  const { orderCancel } = useSelector(state => state.order) // 신규 주문 건
  const { orders, reflesh } = orderCancel
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [orderType, setOrderType] = React.useState('') // 주문 Type
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(true)
  const [firstInifinite, setFirstInfinite] = React.useState(false);
  const [orderCnt, setOrderCnt] = React.useState(0);

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

    if(Array.isArray(orders)) {
      if (isLoading) {
        setOrderCnt(orders.length)
        return
      } else if (orders && orders.length === orderCnt && firstInifinite) {
        setOrderCnt(orders.length)
        return
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


  const renderRow = ({ item, index }) => {
    
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('OrderDetail', {
            od_id: item.od_id,
            od_time: item.od_time,
            type: 'cancel',
            jumjuId: item.jumju_id,
            jumjuCode: item.jumju_code
          })}
      >
        <View
          style={{
            backgroundColor: '#F8F8F8',
            width: '100%',
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10
          }}
        >
          <Text style={{ ...BaseStyle.ko12 }}>
            {moment(item.od_time).format('YYYY년 M월 D일 HH:mm')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container7, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
          <View style={{ width: '55%' }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
              {item.mb_company}
            </Text>
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
            <View style={{ ...BaseStyle.container }}>
              <Text
                style={[
                  { ...BaseStyle.ko12 },
                  item.od_settle_case === '선결제' ? BaseStyle.font_blue : BaseStyle.font_pink
                ]}
              >
                {item.od_settle_case}
              </Text>
              <Text style={{ ...BaseStyle.ko12 }}> / </Text>
              <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  ...BaseStyle.mr10
                }}
              >
                <Image
                  source={require('../images/ic_map.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='center'
                />
              </View>
              <View>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    ...BaseStyle.lh17
                  }}
                >
                  {`${item.od_addr1} ${item.od_addr2}`}
                </Text>
                {item.od_addr3 !== '' && (
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                )}
                {item.od_addr_jibeon !== '' &&
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>}
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: Primary.PointColor03,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text style={{ ...BaseStyle.ko13 }}>취소됨</Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <>
      {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='주문취소내역' />
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
              <OrderEmpty text='취소된' />
        }
          />
        </View>}
    </>
  )
}

export default CancelOrders
