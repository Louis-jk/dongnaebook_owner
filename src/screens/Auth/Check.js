import * as React from 'react'
import { View, Text, ActivityIndicator, Image, Linking, Platform } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import VersionCheck from 'react-native-version-check'
import messaging from '@react-native-firebase/messaging'
import { CommonActions } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import * as loginAction from '../../redux/actions/loginAction'
import * as verCheckAction from '../../redux/actions/verCheckAction'
import BaseStyle from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../../components/CusToast'



const Check = props => {
  const { navigation } = props
  const dispatch = useDispatch()
  const [temFcmToken, setTempFcmToken] = React.useState('')
  const [isNeedNewVersion, setNeedNewVersion] = React.useState(false)
  const [appStoreUrl, setAppStoreUrl] = React.useState('')

  VersionCheck.getCountry()
  .then(country => console.log('country ->', country));  

  console.log('getPackageName ->', VersionCheck.getPackageName());        
  console.log('getCurrentBuildNumber ->', VersionCheck.getCurrentBuildNumber()); 
  console.log('getCurrentVersion ->', VersionCheck.getCurrentVersion());     

  if(Platform.OS === 'android') {
    VersionCheck.getLatestVersion({
      provider: 'playStore'  // for Android
    })
    .then(latestVersion => {
      console.log('android latestVersion', latestVersion);    // 0.1.2
    });

    VersionCheck.needUpdate()
    .then(async res => {  
      console.log('version check need update : ', res);  
      
      setNeedNewVersion(res.isNeeded)
      dispatch(verCheckAction.updateVersion(res.isNeeded))
      dispatch(verCheckAction.updateStoreUrl(res.storeUrl))
  
      if (res.isNeeded) {
        navigation.navigate('Home', { screen: 'Login' })
        return;
      }
    });
  }


  if(Platform.OS === 'ios') {    

    let currentVer = VersionCheck.getCurrentVersion(); // 현재 앱의 버전    
    
    /* 앱스토어 url 가져오기
       앱스토어 공유시 url : https://apps.apple.com/kr/app/%EB%8F%99%EB%84%A4%EB%B6%81-%EC%A0%90%EC%A3%BC%EC%9A%A9/id1641656034
       url 가져오기시 url : itms-apps://apps.apple.com/US/app/id1641656034
    */
    VersionCheck.getAppStoreUrl({
      appID: '1641656034'
    }).then(res => setAppStoreUrl(res));

    /**
     * 버전 비교 (예: 1.0.5, 1.0.6)
     * @param {string} verA verA 앱스토어 버전 (예: 1.0.6)
     * @param {string} verB 현재 설치 버전 (예: 1.0.5)
     * @returns 
     */
    const compareVersion = (verA, verB) => {

      var result = true;
      verA = verA.split( '.' ); // .을 기준으로 문자열 배열로 만든다 [6][8]
      verB = verB.split( '.' ); // .을 기준으로 문자열 배열로 만든다 [6][7][99]
    
      const length = Math.max( verA.length, verB.length ); // 배열이 긴쪽의 length를 구함
      
      for ( var i = 0;  i < length ; i ++ ){
        var a = verA[i] ? parseInt(verA[i], 10 ) : 0; // 10진수의 int로 변환할 값이 없을 때 0으로 값을 넣습니다.
        var b = verB[i] ? parseInt(verB[i], 10 ) : 0;
            
        if ( a > b ) {
          result = false;
          break;
        }
      }
      return result;
    }

    const param = {
      type: 'store'
    }

    Api.send('app_version', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if(resultItem && resultItem.result === 'Y') {
        let iosStoreVer = arrItems.ios_version; // appStore 앱 버전        
        
        let isNeeded = !compareVersion(iosStoreVer, currentVer); // 업데이트가 필요한지 체크

        setNeedNewVersion(isNeeded)
        dispatch(verCheckAction.updateVersion(isNeeded))
        dispatch(verCheckAction.updateStoreUrl(appStoreUrl))
  
        if (isNeeded) {
          navigation.navigate('Home', { screen: 'Login' })
          return;
        }

      }
    })    
  }

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

      if (jsonValue !== null) {
        const UserInfo = JSON.parse(jsonValue)
        const uId = UserInfo.userId
        const uPwd = UserInfo.userPwd
        onLoginHandler(uId, uPwd)
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
