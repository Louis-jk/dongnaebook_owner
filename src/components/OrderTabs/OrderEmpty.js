import { View, Text, Dimensions } from 'react-native'
import * as React from 'react'
import BaseStyle from '../../styles/Base'

export default function OrderEmpty ({ text }) {
  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        height: Dimensions.get('window').height - 300
      }}
    >
      <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
        {`아직 ${text} 주문이 없습니다.`}
      </Text>
    </View>
  )
}
