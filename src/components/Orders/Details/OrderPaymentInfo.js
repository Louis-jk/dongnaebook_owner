import React from 'react'
import { View, Text } from 'react-native'
import BaseStyle from '../../../styles/Base'
import Api from '../../../Api'
import RowTable from './RowTable'
import Types from '../../../data/order/types'

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
      
      <RowTable leftText='총 주문금액' rightText={`${Api.comma(detailOrder.odder_cart_price)} 원`} type='normal' />

      {/* 배달 주문일 경우 */}
      {detailOrder.od_type === Types[0].text &&
        <RowTable leftText='배달팁' rightText={`${Api.comma(detailOrder.order_cost)} 원`} type='normal' />
      }
      {/* // 배달 주문일 경우 */}
      
      <RowTable leftText='포인트' rightText={`${Api.comma(detailOrder.order_point)} p`} type='normal' />
      
      {/* 포장 주문일 경우 */}
      {detailOrder.od_type === Types[1].text &&
        <RowTable leftText='포장 할인' rightText={`${Api.comma(detailOrder.order_take_out_discount)} 원`} type='normal' />
      }
      {/* // 포장 주문일 경우 */}

      {/* 식사 주문일 경우 */}
      {detailOrder.od_type === Types[2].text &&
        <RowTable leftText='먹고가기 할인' rightText={`${Api.comma(detailOrder.order_for_here_discount)} 원`} type='normal' />
      }
      {/* // 식사 주문일 경우 */}

      <RowTable leftText='상점 할인 쿠폰' rightText={`${Api.comma(detailOrder.order_coupon_store)} 원`} type='normal' />
      <RowTable leftText='동네북 할인 쿠폰' rightText={`${Api.comma(detailOrder.order_coupon_system)} 원`} type='normal' />
      
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: '#E3E3E3',
          ...BaseStyle.mb20
        }}
      />
      <RowTable leftText='총 결제금액' rightText={`${Api.comma(detailOrder.order_sumprice)} 원`} type='bold' fontSize={16} />
      <RowTable leftText='결제방법' rightText={detailOrder.od_settle_case} type='normal' />
    </View>
  )
}

export default OrderPaymentInfo
