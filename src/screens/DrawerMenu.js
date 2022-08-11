import React from 'react'
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView, Alert } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import BaseStyle from '../styles/Base'
import { DrawerMenus } from '../data/drawerMenus'
import cusToast from '../components/CusToast'

const DrawerMenu = props => {
  const { navigation } = props

  // 로그아웃
  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem('@dongnaebookownerUser')
      cusToast('로그아웃 하였습니다.')
      navigation.navigate('Home', { screen: 'Login' })
    } catch (err) {
      // console.log('로그아웃 에러', err)
      cusToast(`로그아웃 중 에러가 발생하였습니다.\n오류:${err}`, 2500)
      // Alert.alert('로그아웃 중 에러가 발생하였습니다.', '다시 시도해보세요', [
      //   {
      //     text: '확인'
      //   }
      // ])
    }
  }

  return (
    <View
      style={{
        position: 'relative',
        flex: 1,
        height: Dimensions.get('window').height,
        backgroundColor: '#fff',
        borderTopLeftRadius: 50
      }}
    >
      <View
        style={{
          position: 'relative',
          ...BaseStyle.container0,
          ...BaseStyle.pv10,
          height: 60
        }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>설정</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.closeDrawer()}
          style={{ position: 'absolute', right: 20, top: 20 }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require('../images/pop_close_bk.png')}
            style={{ width: 22, height: 22 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...BaseStyle.mv10 }}>
          {DrawerMenus.map((menu, index) => (
            <TouchableOpacity
              key={`${menu.name}-${index}`}
              activeOpacity={1}
              onPress={() => {
                if (menu.name !== '로그아웃') {
                  navigation.navigate('Home', { screen: menu.route })
                } else {
                  onLogoutHandler()
                }
              }}
              style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
            >
              <View style={{ ...BaseStyle.container }}>
                <Image
                  source={menu.icon}
                  style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                  resizeMode='contain'
                />
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{menu.name}</Text>
              </View>
              <Image
                source={require('../images/set_arrow.png')}
                style={{ width: 30, height: 12 }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

export default DrawerMenu
