import React from "react"
import { View, Text, Image, SafeAreaView, TouchableOpacity, Platform } from "react-native"
import { DrawerActions } from "@react-navigation/native"
import DropDownPicker from "react-native-dropdown-picker"
import BaseStyle, { Primary } from "../styles/Base"

const SetHeader = props => {
  const { navigation, title, type, toggleModal } = props

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20, paddingVertical: Platform.OS === 'ios' ? 10 : 20 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require("../images/top_ic_history.png")}
            style={{ width: 30, height: 20 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>{title}</Text>
        {type === "add" || type === "save" ? (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              if (type === "add") {
                toggleModal()
              } else {
                alert("저장")
              }
            }}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>
              {type === "add" ? "추가" : "저장"}
            </Text>
          </TouchableOpacity>
        ) : (
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
        )}
      </View>
      <View style={{ height: 1, width: "100%", backgroundColor: "#E3E3E3", ...BaseStyle.mb20 }} />
    </SafeAreaView>
  )
}

export default SetHeader
