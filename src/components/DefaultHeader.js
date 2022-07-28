import React from "react"
import { View, Text, Image, SafeAreaView, TouchableOpacity, Dimensions } from "react-native"
import { DrawerActions } from "@react-navigation/native"
import BaseStyle from "../styles/Base"
import { useSelector } from "react-redux"

const { width: FWIDTH, height: FHEIGHT } = Dimensions.get("screen")

const DefaultHeader = props => {
  const { navigation } = props
  const { mt_store: mtStore } = useSelector(state => state.login)
  // const {selectedStore} = useSelector((state) => state.store);

  return (
    <SafeAreaView>
      <View
        style={{
          ...BaseStyle.container5,
          ...BaseStyle.ph20,
          ...BaseStyle.pv15,
        }}
      >
        <View style={{ ...BaseStyle.container }}>
          <Image
            source={require("../images/logo.png")}
            style={{ width: 100, height: 25 }}
            resizeMode="contain"
          />
          <View style={{ width: "80%", maxWidth: FWIDTH / 3 }}>
            <Text
              style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.ml10 }}
              numberOfLines={1}
              lineBreakMode="tail"
            >
              {mtStore}
            </Text>
          </View>
        </View>
        <View style={{ ...BaseStyle.container }}>
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Home', {screen: 'SelectStore'})}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}
            style={{...BaseStyle.mr10}}>
            <Image
              source={require('../images/ic_menu2.png')}
              style={{width: 30, height: 30}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Image
              source={require("../images/ic_menu.png")}
              style={{ width: 30, height: 30 }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

export default DefaultHeader
