import { View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import OrderEmpty from './OrderEmpty'
import * as orderAction from '../../redux/actions/orderAction'
import OrdersAnimateLoading from '../OrdersAnimateLoading'

const Tab04 = props => {
  const { navigation } = props
  const { orderDone } = useSelector(state => state.order) // 처리완료 건
  const { orders, reflesh } = orderDone
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
        dispatch(orderAction.updateDoneOrderLimit(5))
      }
    }
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    dispatch(orderAction.getDoneOrder())
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
          <Text style={{ ...BaseStyle.ko14 }}>
            {moment(item.od_time).format('YYYY년 M월 D일 HH:mm')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>

          {/* 주문 정보 */}
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: '100%' }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'done',
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
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white, marginBottom: Platform.OS === 'ios' ? 2 : 0 }}>{item.od_type}</Text>
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
                    ...BaseStyle.ko14,
                    ...BaseStyle.lh20
                  }}
                >
                  {`${item.od_addr1} ${item.od_addr2}`}
                </Text>
                {item.od_addr3 !== '' && (
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20 }}>{item.od_addr3}</Text>
                )}
                {item.od_addr_jibeon !== '' &&
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20 }}>
                    {item.od_addr_jibeon}
                  </Text>}
              </View>
            </View>
            {/* // 배달 주소 */}
          </TouchableOpacity>
          {/* // 주문 정보 */}
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
              <OrderEmpty text='완료된' />
        }
          />
        </View>}
    </>
  )
}

export default React.memo(Tab04)
