import React from 'react'
import { View, Text } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'

const AppTest = () => {
  const onChangeText = (evt) => {
    console.log('onChangeText evt', evt)
  }

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>테스트 컴포넌트</Text>
      <TextInput placeholder='Enter data' onChangeText={onChangeText} />
    </View>
  )
}

export default AppTest
