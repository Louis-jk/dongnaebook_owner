import * as React from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  ToastAndroid,
} from "react-native"
import { useSelector } from "react-redux"
import Header from "../components/NoDrawerHeader"
import BaseStyle, { Primary } from "../styles/Base"
import Api from "../Api"
import cusToast from "../components/CusToast"

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("screen")

const FindId = props => {
  const { navigation } = props
  const { type } = props.route.params
  const { mt_app_token } = useSelector(state => state.login)
  const [userName, setUserName] = React.useState("")
  const [userMobile, setUserMobile] = React.useState("") // 휴대폰번호
  const [certifyNum, setCertifyNum] = React.useState("") // 사용자 입력 인증번호
  const [certLimit, setCertLimit] = React.useState(1) // 카운트 종료
  const [minutes, setMinutes] = React.useState(0) // 카운트 분 설정
  const [seconds, setSeconds] = React.useState(0) // 카운트 초 설정
  const [hpDisabled, setHpDisabled] = React.useState(true)
  const [certno, setCertno] = React.useState("") // 서버로부터 온 인증번호(확인용)
  const [mt_certify, setCertify] = React.useState(false) // 인증유무
  const [findResult, setFindResult] = React.useState(false) // 인증 완료 상태
  const [findIdResult, setFindIdResult] = React.useState(false) // 인증 완료 후 회원 ID값
  const [buttonDisabled, setButtonDisabled] = React.useState(false)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction)
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction)
  }, [])

  React.useEffect(() => {
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1)
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown)
          setCertLimit(0)
          if (!mt_certify) {
            setHpDisabled(true)
          }
        } else {
          setMinutes(parseInt(minutes) - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => clearInterval(countdown)
  }, [minutes, seconds, mt_certify])

  const sendCertifyNum = () => {
    const param = {
      mt_level: "5",
      mt_hp: userMobile,
      mt_app_token,
    }

    console.log("param", param)

    Api.send("member_hp_chk", param, args => {
      let resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === "Y") {
        Api.send("member_sms_send", { mt_hp: userMobile }, args => {
          let resultItem = args.resultItem
          let arrItems = args.arrItems
          if (resultItem.result === "Y") {
            console.log(arrItems)
            setHpDisabled(false)
            setCertify(false)
            setCertno(arrItems.certno)
            // if (act && arrItems.mt_id) {
            //     setTempId(arrItems.mt_id);
            // }

            setCertLimit(1)
            setMinutes(5)
            setSeconds(0)

            // Platform.OS === 'android' && _onSmsListenerPressed();
          }
        })
      } else {
        cusToast("휴대폰번호를 입력해주세요")
        return false
      }
    })
  }

  const confirmHandler = () => {
    if (certLimit === 0) {
      cusToast("인증시간이 만료되었습니다. 재인증해주세요.")
      return false
    } else {
      console.log("certno ??", certno)
      console.log("certifyNum ??", certifyNum)

      if (certno === parseInt(certifyNum)) {
        var method = ""
        var param = { mt_hp: userMobile, mt_level: "5", certno: certifyNum, mt_app_token }

        if (type === "findId") {
          method = "member_find_id"
        } else if (type === "findPwd") {
          method = "member_find_pwd"
        } else {
          return false
        }
        console.log(method, param)
        setButtonDisabled(true)

        Api.send(method, param, args => {
          let resultItem = args.resultItem
          let arrItems = args.arrItems

          console.log("인증 후 arrItems", arrItems)

          if (resultItem.result === "Y") {
            setCertify(true)
            setSeconds(0)

            if (resultItem.message) {
              cusToast(resultItem.message)
            }

            setFindResult(true)

            if (type === "findId") {
              setFindIdResult(arrItems.mt_id)
            } else if (type === "findPwd") {
              setFindResult(true)
              // props.navigation.navigate('RegisterUpdatePwd', {
              //   temp_id: arrItems.mt_id,
              //   mt_hp: values.mt_hp,
              // });
            } else {
              setCertify(false)
              setCertLimit(1)

              setCertno("")
              setCertifyNum("")
            }
          } else {
            if (resultItem.message === "member_login_history") {
              setIsCusAlertVisible(true)
              setCAtitle("")
              setCAmessage("로그인이 만료되었습니다.\n재로그인이 필요합니다.")
            } else {
              setButtonDisabled(false)
              setCertify(false)
              cusToast(resultItem.message)
            }
          }
        })
      } else {
        setCertify(false)
        cusToast("인증번호가 일치하지 않습니다")
        return false
      }
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header navigation={navigation} title={type === "findId" ? "아이디 찾기" : "비밀번호 찾기"} />
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          alignItems: "center",
          ...BaseStyle.ph20,
          ...BaseStyle.mt50,
        }}
      >
        <Text style={{ ...BaseStyle.ko20, ...BaseStyle.font_bold, ...BaseStyle.mb30 }}>
          {type === "findId" ? "아이디" : "비밀번호"}를 잊으셨나요?
        </Text>
        <View style={{ ...BaseStyle.mb30, width: SCREEN_WIDTH - 40 }}>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb10, ...BaseStyle.font_bold }}>
            휴대폰 인증
          </Text>
          <View style={{ ...BaseStyle.container, height: 50, marginBottom: 10 }}>
            <TextInput
              value={userMobile}
              placeholder="휴대전화번호를 입력해주세요."
              style={{ flex: 2, ...BaseStyle.border, ...BaseStyle.ph10, ...BaseStyle.inputH }}
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={text => setUserMobile(text)}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={sendCertifyNum}
              style={{
                flex: 0.5,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: Primary.PointColor01,
                height: "100%",
                paddingHorizontal: 20,
                borderRadius: 5,
                marginLeft: 10,
              }}
            >
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>
                {hpDisabled ? "인증받기" : "재발송"}
              </Text>
            </TouchableOpacity>
          </View>
          <View>
            <TextInput
              value={certifyNum}
              placeholder="인증번호를 입력해주세요."
              style={{ ...BaseStyle.border, ...BaseStyle.ph10, ...BaseStyle.inputH }}
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={text => setCertifyNum(text)}
            />
            {minutes || seconds ? (
              <View style={{ paddingRight: 12 }}>
                <Text style={[BaseStyle.ko12, { color: "red" }]}>
                  {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                </Text>
              </View>
            ) : null}
          </View>

          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mt10 }}>
            {"제한 시간(5분) 내에 인증번호를 입력해 주세요"}
          </Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={confirmHandler}
          style={{
            ...BaseStyle.mainBtn,
            height: 55,
          }}
        >
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>다음</Text>
        </TouchableOpacity>
      </View>
      {findResult && findIdResult && type === "findId" ? (
        <View style={[styles.mt24]}>
          <Text style={[BaseStyle.ko14, { textAlign: "center" }]}>
            {"회원님의 아이디는"}
            {"\n\n"}
            <Text style={[BaseStyle.ko15, BaseStyle.font_bold, BaseStyle.mt24]}>
              {" "}
              {findIdResult}{" "}
            </Text>
            {"입니다."}
          </Text>
          <TouchableOpacity activeOpacity={0.8} onPress={() => navigation.navigate("Login")}>
            <Text>로그인</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  )
}

export default FindId
