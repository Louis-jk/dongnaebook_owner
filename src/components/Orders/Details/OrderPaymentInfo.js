import React from 'react'
import { View, Text } from 'react-native'
import BaseStyle from '../../../styles/Base'
import Api from '../../../Api'

const OrderPaymentInfo = props => {
  const { detailOrder } = props

  return (
    <View
      style={{
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
  )
}

export default OrderPaymentInfo
