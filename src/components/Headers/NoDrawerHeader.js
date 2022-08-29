import React from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity } from 'react-native'
import BaseStyle from '../../styles/Base'
import Divider from '../Divider'

const DefaultHeader = props => {
  const { navigation, title } = props

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.container3, ...BaseStyle.ph20, ...BaseStyle.pv15 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require('../../images/top_ic_history.png')}
            style={{ width: 30, height: 20 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.ml5 }}>{title}</Text>
      </View>
      <Divider backgroundColor='#E3E3E3' />
    </SafeAreaView>
  )
}

export default DefaultHeader
