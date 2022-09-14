import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle from '../../../styles/Base'
import Types from '../../../data/order/types'
import Api from '../../../Api'

const OrderInfo = ({ navigation, item, tabIndex }) => {
  return (
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
            <Image source={require('../../../images/icon_delivery_wh.png')} style={{ width: 23, height: 13 }} resizeMode={Platform.OS === 'android' ? 'center' : 'contain'} fadeDuration={500} />}
          {item.od_type === Types[1].text &&
            <Image source={require('../../../images/icon_wrap_wh.png')} style={{ width: 15, height: 17 }} resizeMode={Platform.OS === 'android' ? 'center' : 'contain'} fadeDuration={500} />}
          {item.od_type === Types[2].text &&
            <Image source={require('../../../images/icon_store_wh.png')} style={{ width: 22, height: 17 }} resizeMode={Platform.OS === 'android' ? 'center' : 'contain'} fadeDuration={500} />}
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
  )
}

export default OrderInfo
