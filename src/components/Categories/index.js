import { Image, Platform } from 'react-native'
import React from 'react'
import RNPickerSelect from 'react-native-picker-select'
import BaseStyle, { customPickerStyles } from '../../styles/Base'

const Categories = ({ selectCategory, setSelectCategory, items }) => {
  return (
    <RNPickerSelect
      fixAndroidTouchableBug
      value={selectCategory}
      useNativeAndroidPickerStyle={false}
      placeholder={{ label: '선택해주세요.', value: null }}
      onValueChange={value => setSelectCategory(value)}
      items={items}
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

export default Categories
