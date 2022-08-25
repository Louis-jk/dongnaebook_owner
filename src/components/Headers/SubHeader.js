import React from 'react'
import { View, Text, Image, SafeAreaView, TouchableOpacity, Dimensions, Platform } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { useSelector } from 'react-redux'
import BaseStyle from '../../styles/Base'

const DefaultHeader = props => {
  const { navigation, title } = props
  const { mt_store: mtStore } = useSelector(state => state.login)

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, paddingVertical: Platform.OS === 'ios' ? 10 : 15 }}>
        <View style={{ ...BaseStyle.container }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            style={{ ...BaseStyle.mr10 }}
          >
            <Image
              source={require('../../images/top_ic_history.png')}
              style={{ width: 20, height: 20 }}
              resizeMode='contain'
            />
          </TouchableOpacity>
          <View
            style={{
              ...BaseStyle.container,
              justifyContent: 'flex-start',
              alignItems: 'baseline'
            }}
          >
            <Text
              style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}
              numberOfLines={1}
            >
              {title}
            </Text>
            <View style={{ width: '100%', maxWidth: Dimensions.get('window').width / 3 }}>
              <Text
                style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, color: '#888' }}
                numberOfLines={1}
                lineBreakMode='tail'
              >
                ({mtStore})
              </Text>
            </View>
          </View>
        </View>
        <View style={{ ...BaseStyle.container }}>
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
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />
    </SafeAreaView>
  )
}

export default DefaultHeader
