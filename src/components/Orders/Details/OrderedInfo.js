import React from 'react'
import { View, Text, TouchableOpacity, Alert, Linking } from 'react-native'
import BaseStyle from '../../../styles/Base'
import Types from '../../../data/order/types'
import Api from '../../../Api'

const OrderedInfo = props => {
  const { detailOrder } = props

  return (
    <View style={{ ...BaseStyle.mv15 }}>
      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
        {detailOrder.od_type} 정보
      </Text>
      {detailOrder.od_type === Types[0].text &&
        <View
          style={{
            ...BaseStyle.container3,
            justifyContent: 'space-between',
            ...BaseStyle.mb10
          }}
        >
          <View style={{ width: '30%' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>배달주소</Text>
          </View>
          <View style={{ marginTop: -2, width: '65%' }}>
            <View style={{ ...BaseStyle.mb10 }}>
              <Text
                style={{
                  ...BaseStyle.ko14,
                  ...BaseStyle.font_333,
                  ...BaseStyle.lh24,
                  textAlign: 'right'
                }}
              >
                {`${detailOrder.order_addr1} ${detailOrder.order_addr3 !== '' ? detailOrder.order_addr3 : ''}`}
              </Text>
              {/* <Text
                              style={{
                                ...BaseStyle.ko14,
                                ...BaseStyle.font_333,
                                ...BaseStyle.lh17,
                                textAlign: 'right'
                              }}
                            >
                              {`${detailOrder.order_addr3}`}
                            </Text> */}
            </View>
            {detailOrder.od_addr_jibeon !== '' &&
              <View style={{ ...BaseStyle.mb10 }}>
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.font_333,
                    ...BaseStyle.lh17,
                    textAlign: 'right'
                  }}
                >
                  {`${detailOrder.od_addr_jibeon}`}
                </Text>
              </View>}
          </View>
        </View>}
      {detailOrder.od_type === Types[2].text &&
        <View
          style={{
            ...BaseStyle.container3,
            justifyContent: 'space-between'
          }}
        >
          <View style={{ width: '30%' }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>식사인원수</Text>
          </View>
          <View style={{ width: '65%' }}>
            <View style={{ marginBottom: 5 }}>
              <Text
                style={{
                  ...BaseStyle.ko14,
                  ...BaseStyle.font_333,
                  ...BaseStyle.lh24,
                  textAlign: 'right'
                }}
              >
                {detailOrder.od_forhere_num !== '' ? detailOrder.od_forhere_num : '0'} 명
              </Text>
            </View>
            {detailOrder.od_addr_jibeon !== '' &&
              <View style={{ ...BaseStyle.mb10 }}>
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.font_333,
                    ...BaseStyle.lh17,
                    textAlign: 'right'
                  }}
                >
                  {`${detailOrder.od_addr_jibeon}`}
                </Text>
              </View>}
          </View>
        </View>}
      <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
        <View style={{ width: '30%' }}>
          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>전화번호</Text>
        </View>
        <TouchableOpacity
          activeOpacity={1}
          style={{ width: '65%' }}
          onPress={() => {
            Alert.alert('주문자에게 전화를 거시겠습니까?', '', [
              {
                text: '전화걸기',
                onPress: () => Linking.openURL(`tel: ${detailOrder.order_hp}`)
              },
              {
                text: '취소'
              }
            ])
          }}
        >
          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_333, textAlign: 'right' }}>
            {Api.phoneFomatter(detailOrder.order_hp)}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default OrderedInfo
