import { Image } from 'react-native'
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
            style={{ width: 45, height: 45 }}
            resizeMode='center'
          />
        )
      }}
    />
  )
}

export default Categories
