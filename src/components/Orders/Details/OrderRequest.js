import React from 'react'
import { View, Text } from 'react-native'
import Types from '../../../data/order/types'
import BaseStyle from '../../../styles/Base'
import RowTable from './RowTable'

const OrderRequest = props => {
  const { detailOrder } = props

  return (
    <View style={{ ...BaseStyle.mv15 }}>
      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
        요청사항
      </Text>
      <RowTable 
        leftWidth='30%' 
        rightWidth='65%' 
        leftText='사장님께' 
        rightText={detailOrder.order_seller ? detailOrder.order_seller : '요청사항이 없습니다.'} 
        type='normal'
        marginBottom={detailOrder.od_type !== Types[0].text ? 0 : 10}
      />

      {detailOrder.od_type === Types[0].text &&
      <>
        <RowTable 
          leftWidth='30%' 
          rightWidth='65%' 
          leftText='배달기사님께' 
          rightText={detailOrder.order_officer ? detailOrder.order_officer : '요청사항이 없습니다.'} 
          type='normal'
        />

        <RowTable 
          leftWidth='50%' 
          rightWidth='45%' 
          leftText='일회용 수저, 포크 유무' 
          rightText={detailOrder.od_no_spoon == '1' ? '필요없음' : '필요함'} 
          type='normal'
          marginBottom={0}
        />
      </>
      }
    </View>
  )
}

export default OrderRequest
