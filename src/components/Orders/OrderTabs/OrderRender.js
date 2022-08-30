import React from 'react'
import { View, Text } from 'react-native'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle from '../../../styles/Base'
import OrderMoreInfo from './OrderMoreInfo'

const OrderRender = (props) => {
  const { item, children } = props

  return (
    <>
      {/* 주문 날자 및 상호 정보 (상단 바) */}
      <View
        style={{
          ...BaseStyle.container5,
          ...BaseStyle.pv10,
          ...BaseStyle.ph20,
          ...BaseStyle.mb10,
          backgroundColor: '#F8F8F8',
          width: '100%'
        }}
      >
        <Text style={{ ...BaseStyle.ko14, maxWidth: '50%' }}>
          {moment(item.od_time).format('YYYY년 M월 D일')}
        </Text>
        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, maxWidth: '50%' }} numberOfLines={1}>
          {item.mb_company}
        </Text>
      </View>
      {/* // 주문 날자 및 상호 정보 (상단 바) */}

      {/* 주문 정보 및 처리 버튼, 하단 주소 또는 인원 수 등 */}
      <View style={{ ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
        <View style={{ ...BaseStyle.container7 }}>

          {/* 주문 정보 : OrderInfo */}
          {children[0]}
          {/* // 주문 정보 : OrderInfo */}

          {/* 버튼 영역 : OrderButtons */}
          {children[1]}
          {/* // 버튼 영역 : OrderButtons */}

        </View>

        {/* 배달 주소 | 식사 인원수 : OrderMoreInfo */}
        <OrderMoreInfo item={item} orderType={item.od_type} />
        {/* // 배달 주소 | 식사 인원수 : OrderMoreInfo */}

      </View>
      {/* // 주문 정보 및 처리 버튼, 하단 주소 또는 인원 수 등 */}
    </>
  )
}

export default OrderRender
