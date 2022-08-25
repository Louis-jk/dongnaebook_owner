import * as React from 'react'
import { View, Text, ActivityIndicator, Image } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import messaging from '@react-native-firebase/messaging'
import { CommonActions } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import * as loginAction from '../../redux/actions/loginAction'
import BaseStyle from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../../components/CusToast'

const Check = props => {
  const { navigation } = props
  const dispatch = useDispatch()
  const [temFcmToken, setTempFcmToken] = React.useState('')

  // FCM 토큰 가져오기
  const getTokenPlatformAPI = async () => {
    await messaging()
      .getToken()
      .then(currentToken => {
        setTempFcmToken(currentToken)
      })
      .catch(err => {
        console.log('token err :: ', err)
      })
  }

  //  자동 토큰 업데이트
  const storeAddToken = async () => {
    try {
      const jsonValue = JSON.stringify({ token: temFcmToken })
      await AsyncStorage.setItem('@dongnaebookownerToken', jsonValue)
    } catch (err) {
      cusToast(`관리자에게 문의해주세요.\n오류:${err}`, 2500)
      // Alert.alert(err, '관리자에게 문의하세요', [
      //   {
      //     text: '확인'
      //   }
      // ])
    }
  }

  const onLoginHandler = (uEmail, uPwd) => {
    const param = {
      mt_id: uEmail,
      mt_pwd: uPwd,
      mt_app_token: temFcmToken
    }

    Api.send('store_login', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      // console.log('====================================')
      // console.log('로그인 resultItem ::', resultItem)
      // console.log('로그인 arrItems ::', arrItems)
      // console.log('====================================')

      if (resultItem.result === 'Y') {
        storeAddToken()
        dispatch(loginAction.updateLogin(JSON.stringify(arrItems)))
        const resetAction = CommonActions.reset({
          index: 1,
          routes: [{ name: 'Main' }]
        })
        navigation.dispatch(resetAction)
      } else {
        navigation.navigate('Home', { screen: 'Login' })
      }
    })
  }

  //  Async Storage에 UserID, UserPwd가 있는지 확인(자동로그인의 경우)
  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@dongnaebookownerUser')
      //   const jsonToken = await AsyncStorage.getItem('@dongnaebookownerToken');
      if (jsonValue !== null) {
        console.log('dongnaebookownerUser get ::', JSON.parse(jsonValue))
        // console.log('dongnaebookownerToken get ::', JSON.parse(jsonToken));

        const UserInfo = JSON.parse(jsonValue)
        const uId = UserInfo.userId
        const uPwd = UserInfo.userPwd
        onLoginHandler(uId, uPwd)
        // // 있다면 로그인API 호출 (UserID, UserPwd, FcmToken, Platform)
        // login(uId, uPwd, token, device);
      } else {
        navigation.navigate('Home', { screen: 'Login' })
      }
    } catch (err) {
      console.log('storage get item err :', err)
      navigation.navigate('Home', { screen: 'Login' })
    }
  }

  React.useEffect(() => {
    getTokenPlatformAPI()
    getData()
  }, [])

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Primary.PointColor03
        backgroundColor: '#fff'
      }}
    >
      <Image
        source={require('../../images/c_logo.png')}
        style={{ width: 80, height: 80 }}
        resizeMode='contain'
      />
      <Text
        style={{
          ...BaseStyle.ko14,
          ...BaseStyle.font_666,
          ...BaseStyle.mt10,
          ...BaseStyle.mb30,
          ...BaseStyle.font_main
        }}
      >
        자동 로그인 체크중..
      </Text>
      <ActivityIndicator size='large' color='#fff' />
    </View>
  )
}

export default Check
