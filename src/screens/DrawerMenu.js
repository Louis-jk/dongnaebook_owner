import React from "react"
import { View, Text, Dimensions, TouchableOpacity, Image, ScrollView } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"
import BaseStyle from "../styles/Base"

const DrawerMenu = props => {
  const { navigation } = props

  // 로그아웃
  const onLogoutHandler = async () => {
    try {
      await AsyncStorage.removeItem("@dongnaebookownerUser")
      navigation.navigate("Home", { screen: "Login" })
    } catch (e) {
      console.log("로그아웃 에러", e)
    }
  }

  return (
    <View
      style={{
        position: "relative",
        flex: 1,
        height: Dimensions.get("window").height,
        backgroundColor: "#fff",
        borderTopLeftRadius: 50,
      }}
    >
      <View
        style={{
          ...BaseStyle.container0,
          position: "relative",
          ...BaseStyle.pv10,
          height: 60,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>설정</Text>
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={() => navigation.closeDrawer()}
          style={{ position: "absolute", right: 20, top: 20 }}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require("../images/pop_close_bk.png")}
            style={{ width: 22, height: 22 }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={{ height: 1, width: "100%", backgroundColor: "#E3E3E3" }} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...BaseStyle.mv10 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "SelectStore" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set10.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>매장 선택</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Main")}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set02.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>주문 내역</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("CancelOrders")}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set15.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>주문 취소 내역</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "Calculate" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set01.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>정산 내역</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("SetDayTime")}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set04.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>영업시간 및 휴무일</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('SetCloseDay')}
            style={{...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20}}>
            <View style={{...BaseStyle.container}}>
              <Image
                source={require('../images/set04.png')}
                style={{width: 30, height: 30, ...BaseStyle.mr10}}
                resizeMode="contain"
              />
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold}}>휴무일 설정</Text>
            </View>
            <Image
              source={require('../images/set_arrow.png')}
              style={{width: 30, height: 12}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}

          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('SetRestTime')}
            style={{...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20}}>
            <View style={{...BaseStyle.container}}>
              <Image
                source={require('../images/set05.png')}
                style={{width: 30, height: 30, ...BaseStyle.mr10}}
                resizeMode="contain"
              />
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold}}>휴게 시간 설정</Text>
            </View>
            <Image
              source={require('../images/set_arrow.png')}
              style={{width: 30, height: 12}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("SetTips")}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set06.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>배달팁 안내 및 금액</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "setCategory" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set13.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>카테고리 관리</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "SetMenu" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set07.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>메뉴 관리</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "Coupon" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set14.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>쿠폰 관리</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "StoreInfo" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set08.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>매장 소개</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "StoreSetting" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set08_setting.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>매장 설정</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          {/* <TouchableOpacity
            activeOpacity={1}
            style={{...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20}}>
            <View style={{...BaseStyle.container}}>
              <Image
                source={require('../images/set09.png')}
                style={{width: 30, height: 30, ...BaseStyle.mr10}}
                resizeMode="contain"
              />
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold}}>안내 및 혜택</Text>
            </View>
            <Image
              source={require('../images/set_arrow.png')}
              style={{width: 30, height: 12}}
              resizeMode="contain"
            />
          </TouchableOpacity> */}

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "Reviews" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set11.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>리뷰 관리</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate("Home", { screen: "Notice" })}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/set12.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>공지사항</Text>
            </View>
            <Image
              source={require("../images/set_arrow.png")}
              style={{ width: 30, height: 12 }}
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => onLogoutHandler()}
            style={{ ...BaseStyle.container5, ...BaseStyle.ph20, ...BaseStyle.pv20 }}
          >
            <View style={{ ...BaseStyle.container }}>
              <Image
                source={require("../images/logout.png")}
                style={{ width: 30, height: 30, ...BaseStyle.mr10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>로그아웃</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  )
}

export default DrawerMenu
