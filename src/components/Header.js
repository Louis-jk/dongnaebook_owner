import React from 'react';
import { View, Text, Image, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { DrawerActions } from '@react-navigation/native';
import BaseStyle from '../styles/Base';
import { useSelector } from 'react-redux';

const DefaultHeader = props => {
  const { navigation, title } = props
  const { store_name } = useSelector(state => state.store)

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv15 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require('../images/top_ic_history.png')}
            style={{ width: 30, height: 20 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
        <View style={{ maxWidth: Dimensions.get('window').width / 3 }}>
          <Text
            style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}
            numberOfLines={1}
            lineBreakMode='tail'
          >
            {title}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Image
              source={require('../images/ic_menu.png')}
              style={{ width: 30, height: 30 }}
              resizeMode='contain'
            />
          </TouchableOpacity>
        </View>
      </View>
      <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />
    </SafeAreaView>
  )
};

export default DefaultHeader
