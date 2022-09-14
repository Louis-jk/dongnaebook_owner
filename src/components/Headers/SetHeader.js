import React from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity, Platform, Alert } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import BaseStyle from '../../styles/Base'
import Divider from '../Divider'

const SetHeader = props => {
  const { navigation, title, type, toggleModal } = props

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, paddingVertical: Platform.OS === 'ios' ? 10 : 15 }}>
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
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, marginTop: Platform.OS === 'ios' ? -2 : 0 }}>{title}</Text>
        {(type === 'add' || type === 'save') &&
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (type === 'add') {
                toggleModal()
              } else {
                Alert.alert('저장')
              }
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>
              {type === 'add' ? '추가' : '저장'}
            </Text>
          </TouchableOpacity>}
        {(type !== 'add' && type !== 'save') &&
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Image
              source={require('../../images/ic_menu.png')}
              style={{ width: 30, height: 30 }}
              resizeMode='contain'
            />
          </TouchableOpacity>}
      </View>
      <Divider backgroundColor='#E3E3E3' />
      <View style={{ marginBottom: type === 'add' || type === 'save' ? 20 : 0 }} />

    </SafeAreaView>
  )
}

export default SetHeader
