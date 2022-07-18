import React from "react";
import {View, Text, TextInput, TouchableOpacity, Dimensions, BackHandler} from "react-native";
import Header from "../components/NoDrawerHeader";
import BaseStyle, {Primary} from "../styles/Base";

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get("screen");

const FindPwd = props => {
  const {navigation} = props;
  const [userId, setUserId] = React.useState("");
  const [userMobile, setUserMobile] = React.useState("");

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Header navigation={navigation} title="비밀번호 찾기" />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          ...BaseStyle.ph20,
          ...BaseStyle.mt50,
        }}>
        <Text style={{...BaseStyle.ko20, ...BaseStyle.font_bold, ...BaseStyle.mb30}}>
          비밀번호를 잊으셨나요?
        </Text>
        <View style={{...BaseStyle.mb20, width: SCREEN_WIDTH - 40}}>
          <Text style={{...BaseStyle.ko16, ...BaseStyle.mb10}}>아이디</Text>
          <TextInput
            value={userId}
            placeholder="아이디를 입력해주세요."
            style={{...BaseStyle.border, ...BaseStyle.ph10, ...BaseStyle.inputH}}
            autoCapitalize="none"
            keyboardType="default"
            onChange={text => setUserId(text)}
          />
          {/* <Text style={{...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mt10}}>
            ※아이디를 입력해주세요.
          </Text> */}
        </View>
        <View style={{...BaseStyle.mb30, width: SCREEN_WIDTH - 40}}>
          <Text style={{...BaseStyle.ko16, ...BaseStyle.mb10}}>휴대전화번호</Text>
          <TextInput
            value={userMobile}
            placeholder="휴대전화번호를 입력해주세요."
            style={{...BaseStyle.border, ...BaseStyle.ph10, ...BaseStyle.inputH}}
            autoCapitalize="none"
            keyboardType="number-pad"
            onChange={text => setUserMobile(text)}
          />
          {/* <Text style={{...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mt10}}>
            ※휴대전화번호를 입력해주세요.
          </Text> */}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            ...BaseStyle.mainBtn,
          }}>
          <Text style={{...BaseStyle.ko16, ...BaseStyle.font_bold}}>비밀번호 찾기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FindPwd;
