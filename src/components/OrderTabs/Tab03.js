import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import OrderEmpty from './OrderEmpty'
import * as orderAction from '../../redux/actions/orderAction'
import OrdersAnimateLoading from '../OrdersAnimateLoading'

const Tab03 = props => {
  const { navigation } = props
  const { deliveryOrders } = useSelector(state => state.order) // 배달중인 주문건
  const { orders, reflesh } = deliveryOrders
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(false)
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
        dispatch(orderAction.updateDeliveryOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getDeliveryOrder())
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={item.od_id + index}>
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
        <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: '100%' }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'going',
                jumjuId: item.jumju_id,
                jumjuCode: item.jumju_code
              })}
          >
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{item.mb_company}</Text>
              <View
                style={{
                  ...BaseStyle.pv2,
                  ...BaseStyle.ph5,
                  ...BaseStyle.ml10,
                  borderRadius: 5,
                  backgroundColor:
                    item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02
                }}
              >
                <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
              </View>
            </View>
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
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <>
    {isLoading && <OrdersAnimateLoading description='데이터를 불러오는 중입니다.' />}

    {!isLoading &&
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
          <OrderEmpty text='배달중인' />
        }
      />
    </View>
    }
    </>
  )
}

export default React.memo(Tab03)
