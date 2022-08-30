import { View, Text, Image } from 'react-native'
import React from 'react'
import BaseStyle from '../../../styles/Base'
import Types from '../../../data/order/types'

const OrderMoreInfo = ({ item, orderType }) => {
  return (

    <View style={{ ...BaseStyle.container, ...BaseStyle.mt10, ...BaseStyle.mr20 }}>
      {orderType === Types[0].text &&
        <>
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
        </>}

      {orderType === Types[2].text &&
        <View>
          <Text
            style={{
              ...BaseStyle.ko14,
              ...BaseStyle.lh20,
              ...BaseStyle.mb3
            }}
            numberOfLines={1}
          >
            식사인원수 : {item.od_forhere_num !== '' ? item.od_forhere_num : '0'}명
          </Text>
        </View>}

    </View>
  )
}

export default OrderMoreInfo
