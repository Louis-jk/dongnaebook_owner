import React from 'react'
import { View, Text } from 'react-native'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle from '../../../styles/Base'
import RowTable from './RowTable'

const OrderedStore = props => {
  const { type, detailStore, orderTime, detailOrder } = props

  return (
    <View style={{ ...BaseStyle.mv15, marginTop: type === 'cancel' ? 15 : 0 }}>
      {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15}}>기본 정보</Text> */}
      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
        주문 매장
      </Text>
      <RowTable 
        leftWidth='30%' 
        rightWidth='65%' 
        leftText='상호명' 
        rightText={detailStore.mb_company} 
        type='normal'
      />
      <RowTable 
        leftWidth='30%' 
        rightWidth='65%' 
        leftText='주문시간' 
        rightText={moment(orderTime).format('YYYY년 M월 D일, HH시 mm분')}
        type='normal'
      />
      <RowTable 
        leftWidth='30%' 
        rightWidth='65%' 
        leftText='주문방법' 
        rightText={`${detailOrder.od_type} 주문`}
        type='normal'
        marginBottom={0}
      />
    </View>
  )
}

export default OrderedStore
