import React from 'react'
import { View, Text } from 'react-native'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle from '../../../styles/Base'

const OrderedStore = props => {
  const { type, detailStore, orderTime, detailOrder } = props

  return (
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
  )
}

export default OrderedStore
