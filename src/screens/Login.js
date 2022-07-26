import * as React from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  BackHandler,
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
} from "react-native";
import {CommonActions} from "@react-navigation/native";
import {useDispatch, useSelector} from "react-redux";
import messaging from "@react-native-firebase/messaging";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as loginAction from "../redux/actions/loginAction";
import BaseStyle, {Primary} from "../styles/Base";
import Api from "../Api";
import AnimateLoading from "../components/AnimateLoading";
import {SafeAreaView} from "react-native-safe-area-context";

const {width, height} = Dimensions.get("window");
const LOGIN_HEIGHT = Dimensions.get("window").height / 2.2;

const Login = props => {
  const {navigation} = props;
  const dispatch = useDispatch();
  const {fcmToken} = useSelector(state => state.login);

  const [userEmail, setUEmail] = React.useState("");
  const [userPwd, setUPwd] = React.useState("");
  const userEmailRef = React.useRef();
  const userPwdRef = React.useRef();
  const [isLoading, setLoading] = React.useState(false);
  const [temFcmToken, setTempFcmToken] = React.useState("");
  const [autoLogin, setAutoLogin] = React.useState(false); // 자동 로그인

  // 안드로이드 뒤로가기 버튼 제어
  let currentCount = 0;

  const backAction = () => {
    if (currentCount < 1) {
      ToastAndroid.show("한번 더 누르면 앱을 종료합니다.", ToastAndroid.SHORT);
      console.log("0에 해당");
      currentCount++;
    } else {
      console.log("1에 해당");
      BackHandler.exitApp();
    }

    setTimeout(() => {
      currentCount = 0;
    }, 2000);

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  // FCM 토큰 가져오기
  const getTokenPlatformAPI = async () => {
    await messaging()
      .getToken()
      .then(currentToken => {
        dispatch(loginAction.updateToken(JSON.stringify(currentToken)));
        setTempFcmToken(currentToken);
      })
      .catch(err => {
        console.log("token err :: ", err);
      });
  };

  React.useEffect(() => {
    getTokenPlatformAPI();
  }, []);

  // 자동 로그인 버튼 on/off
  const toggleAutoLogin = () => {
    setAutoLogin(prev => !prev);
  };

  //  자동 로그인 처리
  const storeData = async () => {
    try {
      const jsonValue = JSON.stringify({userId: userEmail, userPwd: userPwd});
      await AsyncStorage.setItem("@dongnaebookownerUser", jsonValue);
    } catch (e) {
      Alert.alert(e, "관리자에게 문의하세요", [
        {
          text: "확인",
        },
      ]);
    }
  };

  //  자동 토큰 저장
  const storeAddToken = async () => {
    try {
      const jsonValue = JSON.stringify({token: temFcmToken});
      await AsyncStorage.setItem("@dongnaebookownerToken", jsonValue);
    } catch (e) {
      Alert.alert(e, "관리자에게 문의하세요", [
        {
          text: "확인",
        },
      ]);
    }
  };

  const onLoginHandler = () => {
    setLoading(true);

    const param = {
      encodeJson: true,
      mt_id: userEmail,
      mt_pwd: userPwd,
      mt_app_token: temFcmToken,
    };

    Api.send("store_login", param, args => {
      const resultItem = args.resultItem;
      let arrItems = args.arrItems;

      console.log("====================================");
      console.log("로그인 resultItem ::", resultItem);
      console.log("로그인 arrItems ::", arrItems);
      console.log("====================================");

      if (resultItem.result === "Y") {
        if (autoLogin) {
          storeData();
        }
        storeAddToken();
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)));
        setLoading(false);
        const resetAction = CommonActions.reset({
          index: 1,
          routes: [{name: "Main"}],
        });
        navigation.dispatch(resetAction);
      } else {
        setLoading(false);
        Alert.alert("회원정보가 일치하지 않습니다.", "확인 후 다시 로그인해주세요.", [
          {
            text: "확인",
          },
        ]);
        // setButtonDisabled(false);
      }
    });
  };

  return (
    <>
      {isLoading ? (
        <AnimateLoading description="로그인 중입니다." />
      ) : (
        <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
          <View>
            <KeyboardAvoidingView
              behavior="position"
              keyboardVerticalOffset={0}
              style={{backgroundColor: "#fff", borderRadius: 15}}
              enabled>
              <View style={{backgroundColor: "#fff"}}>
                <View
                  style={{
                    ...BaseStyle.container2,
                    width,
                    height: LOGIN_HEIGHT,
                    position: "relative",
                  }}>
                  <Image
                    source={require("../images/login_img.png")}
                    style={{width: "100%", height: "100%", zIndex: -1}}
                    resizeMode="cover"
                  />
                </View>

                <View style={{...BaseStyle.ph20, ...BaseStyle.mv30}}>
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={toggleAutoLogin}
                    style={{...BaseStyle.container, alignSelf: "flex-end", ...BaseStyle.mb15}}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                    <Image
                      source={
                        autoLogin
                          ? require("../images/ic_check_on.png")
                          : require("../images/ic_check_off.png")
                      }
                      style={{width: 20, height: 20, ...BaseStyle.mr5}}
                      resizeMode="contain"
                    />
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_666,
                        ...BaseStyle.font_bold,
                      }}>
                      자동 로그인
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: "#E3E3E3",
                      borderRadius: 5,
                      marginBottom: 3,
                    }}>
                    <TextInput
                      value={userEmail}
                      placeholder="아이디를 입력하세요"
                      style={{
                        ...BaseStyle.inputH,
                        ...BaseStyle.ph20,
                      }}
                      onChangeText={text => setUEmail(text)}
                      autoCapitalize="none"
                      returnKeyLabel="다음"
                      returnKeyType="next"
                      onSubmitEditing={() => userPwdRef.current.focus()}
                    />
                  </View>
                  {/* <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} /> */}
                  <View style={{borderWidth: 1, borderColor: "#E3E3E3", borderRadius: 5}}>
                    <TextInput
                      ref={userPwdRef}
                      value={userPwd}
                      placeholder="비밀번호를 입력하세요"
                      style={{
                        ...BaseStyle.inputH,
                        ...BaseStyle.ph20,
                      }}
                      onChangeText={text => setUPwd(text)}
                      autoCapitalize="none"
                      returnKeyLabel="완료"
                      returnKeyType="done"
                      secureTextEntry
                      // onSubmitEditing={() => onLoginHandler()}
                    />
                  </View>

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => onLoginHandler()}
                    style={{...BaseStyle.mainBtn, ...BaseStyle.mv20}}>
                    <Text
                      style={{...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.font_white}}>
                      로그인
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={() => navigation.navigate("FindPwd")}
                    style={{...BaseStyle.container, alignSelf: "flex-end"}}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_666,
                      }}>
                      비밀번호찾기
                    </Text>
                  </TouchableOpacity>

                  {/* <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: 50,
                  }}>
                  <TouchableOpacity
                    style={{...BaseStyle.container0, alignSelf: 'center'}}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                    onPress={() => navigation.navigate('FindId', {type: 'findId'})}>
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_999,
                        ...BaseStyle.font_bold,
                      }}>
                      아이디 찾기
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={{width: 0.5, height: 15, backgroundColor: '#999', ...BaseStyle.mh10}}
                  />
                  <TouchableOpacity
                    style={{...BaseStyle.container0, alignSelf: 'center'}}
                    hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                    onPress={() => navigation.navigate('FindId', {type: 'findPwd'})}>
                    <Text
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.font_999,
                        ...BaseStyle.font_bold,
                      }}>
                      비밀번호 찾기
                    </Text>
                  </TouchableOpacity>
                </View> */}
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </SafeAreaView>
      )}
    </>
  );
};

export default Login;
