import React from 'react'
import { View, Text } from 'react-native'
import BaseStyle from '../../../styles/Base'

const OrderRequest = props => {
  const { detailOrder } = props

  return (
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
  )
}

export default OrderRequest
