import { View, Text, Image, StyleSheet, Platform } from 'react-native'
import React from 'react'
import RNPickerSelect from 'react-native-picker-select'
import BaseStyle from '../../styles/Base'

const CouponCategory = ({ type, setType }) => {
  const customPickerStyles = StyleSheet.create({
    inputIOS: {
      fontSize: 14,
      paddingVertical: 10,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: '#E3E3E3',
      borderRadius: 5,
      height: 50,
      color: 'black',
      paddingRight: 30 // to ensure the text is never behind the icon
    },
    inputAndroid: {
      fontSize: 14,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 1,
      borderColor: '#E3E3E3',
      borderRadius: 5,
      height: 50,
      color: 'black',
      paddingRight: 30 // to ensure the text is never behind the icon
    }
  })

  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      value={type}
      useNativeAndroidPickerStyle={false}
      placeholder={{ label: '선택해주세요.', value: null }}
      onValueChange={value => setType(value)}
      items={[
        { label: '모두 사용가능', value: '0' },
        { label: '포장용 쿠폰', value: '1' },
        { label: '배달용 쿠폰', value: '2' }
      ]}
      style={{
        ...customPickerStyles,
        borderWidth: 1,
        borderColor: '#E3E3E3',
        ...BaseStyle.round05,
        ...BaseStyle.inputH,
        placeholder: {
          color: '#888'
        }
      }}
      Icon={() => {
        return (
          <Image
            source={require('../../images/ic_select.png')}
            style={[
              Platform.OS === 'ios' && {
                position: 'absolute', right: 15, top: 15
              },
              { width: Platform.OS === 'ios' ? 15 : 45, height: Platform.OS === 'ios' ? 15 : 45 }
            ]}
            resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
          />
        )
      }}
    />
  )
}

export default CouponCategory
