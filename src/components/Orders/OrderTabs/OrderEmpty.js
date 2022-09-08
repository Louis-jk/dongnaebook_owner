import { View, Text, Dimensions, Image, Platform } from 'react-native'
import * as React from 'react'
import BaseStyle, { Primary } from '../../../styles/Base'

export default function OrderEmpty ({ text }) {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: Platform.OS === 'android' ? Dimensions.get('window').height - 150 : Dimensions.get('window').height - 200
      }}
    >
      <Image source={require('../../../images/logo_s.png')} style={{ width: 50, height: 50, opacity: 0.8, marginBottom: 10 }} resizeMode='cover' />
      <Text style={{ ...BaseStyle.ko15, textAlign: 'center', color: Primary.PointColor01 }}>
        {`아직 ${text} 주문이 없습니다.`}
      </Text>
    </View>
  )
}
