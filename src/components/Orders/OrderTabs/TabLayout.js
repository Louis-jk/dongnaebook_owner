import React from 'react'
import { View, Text, FlatList, TouchableOpacity, Image, Platform } from 'react-native'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../../styles/Base'
import Api from '../../../Api'
import OrderEmpty from './OrderEmpty'
import Types from '../../../data/order/types'

const TabLayout = props => {
  const {
    navigation,
    orders,
    index: tabIndex,
    toggleOrderCheckModal,
    toggleModal,
    onHandleRefresh,
    handleLoadMore,
    refleshing,
    deliveryOrderHandler,
    setOrderId,
    setOrderType,
    setJumjuId,
    setJumjuCode
  } = props

  const renderRow = ({ item, index }) => {
    return (
      <View key={index}>
        <View
          style={{
            ...BaseStyle.container5,
            backgroundColor: '#F8F8F8',
            width: '100%',
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10
          }}
        >
          <Text style={{ ...BaseStyle.ko14, maxWidth: '50%' }}>
            {moment(item.od_time).format('YYYY년 M월 D일')}
          </Text>
          <Text style={{ ...BaseStyle.ko14, maxWidth: '50%' }} numberOfLines={1}>
            {item.mb_company}
          </Text>
        </View>
        <View style={{ ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
          <View style={{ ...BaseStyle.container7 }}>

            {/* 주문 정보 */}
            <TouchableOpacity
              activeOpacity={1}
              style={{ flex: 3, ...BaseStyle.container8, paddingRight: 20 }}
              onPress={() =>
                navigation.navigate('OrderDetail', {
                  od_id: item.od_id,
                  od_time: item.od_time,
                  type: tabIndex === 1
                    ? 'ready'
                    : tabIndex === 2
                      ? 'doing'
                      : tabIndex === 3
                        ? 'going'
                        : tabIndex === 4
                          ? 'done'
                          : tabIndex === 5
                            ? 'cancel'
                            : '',
                  jumjuId: item.jumju_id,
                  jumjuCode: item.jumju_code
                })}
            >
              <View style={{ flex: 1, ...BaseStyle.container, marginBottom: 5 }}>
                <Text style={{ fontSize: 33, ...BaseStyle.s_regular, color: '#353535' }}>
                  {moment(item.od_time).format('HH:mm')}
                </Text>
                <View
                  style={{
                    paddingHorizontal: 7,
                    ...BaseStyle.ml10,
                    height: 25,
                    width: 35,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    backgroundColor:
                      item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
                    paddingVertical: Platform.OS === 'android' ? 2 : 0
                  }}
                >
                  {item.od_type === Types[0].text &&
                    <Image source={require('../../../images/icon_delivery_wh.png')} style={{ width: 23, height: 13 }} resizeMode='center' />}
                  {item.od_type === Types[1].text &&
                    <Image source={require('../../../images/icon_wrap_wh.png')} style={{ width: 15, height: 17 }} resizeMode='center' />}
                  {item.od_type === Types[2].text &&
                    <Image source={require('../../../images/icon_store_wh.png')} style={{ width: 22, height: 17 }} resizeMode='center' />}
                </View>
              </View>

              {/* 주문 메뉴명 */}
              <Text style={{ flex: 1, ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5 }} numberOfLines={1}>{item.od_good_name}</Text>
              {/* // 주문 메뉴명 */}

              {/* 결제방법 */}
              <View style={{ flex: 1, ...BaseStyle.container, marginBottom: -3 }}>
                <Text
                  style={[
                    { ...BaseStyle.ko14, maxWidth: '50%' },
                    item.od_settle_case === '선결제' ? BaseStyle.font_blue : BaseStyle.font_pink
                  ]}
                  numberOfLines={1}
                >
                  {item.od_settle_case}
                </Text>
                <Text style={{ ...BaseStyle.ko14 }}> / </Text>
                <Text style={{ ...BaseStyle.ko14, maxWidth: '50%' }} numberOfLines={1}>{Api.comma(item.od_receipt_price)}원</Text>
              </View>
              {/* // 결제방법 */}
            </TouchableOpacity>
            {/* // 주문 정보 */}

            {/* 신규주문 */}
            {/* 접수, 주문거부 버튼 영역 */}
            {tabIndex === 1 &&
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
                    backgroundColor: item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
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
                    {item.od_type}접수
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setOrderId(item.od_id)
                    setOrderType(item.od_type)
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
              </View>}
            {/* // 접수, 주문거부 버튼 영역 */}
            {/* // 신규주문 */}

            {/* 접수완료 */}
            {/* 배달처리 | 포장완료 처리, 주문거부 버튼 영역 */}
            {tabIndex === 2 &&
              <View style={{ flex: 1 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setOrderId(item.od_id)
                    deliveryOrderHandler(item.od_type, item.od_id, item.jumju_id, item.jumju_code)
                  }}
                  style={{
                    backgroundColor:
                  item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.round05,
                    ...BaseStyle.pv10,
                    ...BaseStyle.mb5
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko13,
                      ...BaseStyle.font_bold,
                      // color: item.od_type === "배달" ? "#fff" : "#fff",
                      color: '#fff',
                      marginBottom: Platform.OS === 'ios' ? 4 : 0
                    }}
                  >
                    {item.od_type === Types[0].text ? '배달처리' : item.od_type === Types[1].text ? '포장완료' : '식사완료'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setOrderType(item.od_type)
                    setOrderId(item.od_id)
                    setJumjuId(item.jumju_id)
                    setJumjuCode(item.jumju_code)
                    toggleModal('cancel')
                  }}
                  style={{
                    backgroundColor: '#fff',
                    width: 80,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.round05,
                    ...BaseStyle.pv10,
                    borderWidth: 1,
                    borderColor: '#E3E3E3',
                    ...BaseStyle.round05
                  }}
                >
                  <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}>
                    주문취소
                  </Text>
                </TouchableOpacity>
              </View>}
            {/* // 배달처리 | 포장완료 처리, 주문거부 버튼 영역 */}
            {/* // 접수완료 */}
            {console.log('item ?', item)}
            {/* 배달중 */}
            {tabIndex === 3 &&
              <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={async () => {
                    await setOrderId(item.od_id)
                    await setJumjuId(item.jumju_id)
                    await setJumjuCode(item.jumju_code)
                    await deliveryOrderHandler()
                  }}
                  style={{
                    backgroundColor:
                  item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
                    width: 80,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.round05,
                    ...BaseStyle.pv10,
                    ...BaseStyle.mb5
                  }}
                >
                  <Text
                    style={{
                      textAlign: 'center',
                      ...BaseStyle.ko13,
                      ...BaseStyle.lh20,
                      ...BaseStyle.font_bold,
                      color: '#fff',
                      marginBottom: Platform.OS === 'ios' ? 4 : 0
                    }}
                  >
                    완료처리
                  </Text>
                </TouchableOpacity>
              </View>}
            {/* // 배달중 */}

            {console.log('tabIndex ??', tabIndex)}
            {console.log('item ??', item)}

            {/* 처리완료 */}
            {tabIndex === 4 &&
              <View style={{ flex: 1, alignSelf: 'flex-start' }}>
                <View
                  style={{
                    backgroundColor:
                  item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
                    width: 80,
                    height: 70,
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.round05,
                    ...BaseStyle.pv10,
                    ...BaseStyle.mb5
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko13,
                      ...BaseStyle.font_bold,
                      color: '#fff',
                      marginBottom: Platform.OS === 'ios' ? 4 : 0
                    }}
                  >
                    {item.od_type}완료
                  </Text>
                </View>
              </View>}
            {/* // 처리완료 */}

          </View>
          {/* 배달 주소 */}
          {item.od_type === Types[0].text &&
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt10, ...BaseStyle.mr20 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#999',
                  borderRadius: 18,
                  width: 18,
                  height: 18,
                  marginRight: 5
                }}
              >
                <Image
                  source={require('../../../images/ic_map.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='cover'
                />
              </View>
              <View>
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.lh20,
                    ...BaseStyle.mb3
                  }}
                  numberOfLines={1}
                >
                  {`${item.od_addr1} ${item.od_addr2} ${item.od_addr3 !== '' ? item.od_addr3 : ''}`}
                </Text>
              </View>
            </View>}
          {/* // 배달 주소 */}

          {/* 식사 인원수 */}
          {item.od_type === Types[2].text &&
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt10, ...BaseStyle.mr20 }}>
              <View>
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.lh20,
                    ...BaseStyle.mb3
                  }}
                  numberOfLines={1}
                >
                  식사인원수 : {item.od_forhere_num}명
                </Text>
              </View>
            </View>}
          {/* // 식사 인원수 */}
        </View>
      </View>
    )
  }

  return (

    <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        data={orders}
        renderItem={renderRow}
        keyExtractor={(list, index) => index.toString()}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        refreshing={refleshing}
        onRefresh={() => onHandleRefresh()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        style={{ backgroundColor: '#fff', width: '100%' }}
        ListEmptyComponent={
          <OrderEmpty text={tabIndex === 1 ? '신규' : tabIndex === 2 ? '접수된' : tabIndex === 3 ? '배달중인' : tabIndex === 4 ? '완료된' : tabIndex === 5 ? '취소된' : ''} />
          }
      />
    </View>

  )
}

export default TabLayout
