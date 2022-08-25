import 'react-native-gesture-handler'
import * as React from 'react'
import { View, Text, StatusBar, Dimensions, Platform, LogBox } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator, DrawerContentScrollView } from '@react-navigation/drawer'
import messaging from '@react-native-firebase/messaging'
import Toast from 'react-native-toast-message'
import DrawerMenu from './src/screens/DrawerMenu'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import PushNotification from 'react-native-push-notification'
import { useDispatch } from 'react-redux'
import * as orderAction from './src/redux/actions/orderAction'

/*
 Screen 정의
*/
import CheckScreen from './src/screens/Auth/Check' // 체크
import LoginScreen from './src/screens/Auth/Login' // 로그인
import FindIdScreen from './src/screens/Auth/FindId' // 아이디 찾기
import FindPwdScreen from './src/screens/Auth/FindPwd' // 비밀번호 찾기
import SetNewPwdScreen from './src/screens/SetNewPwd' // 비밀번호 찾기
import MainScreen from './src/screens/Main' // 메인
import CancelOrdersScreen from './src/screens/CancelOrders' // 주문취소건
import OrderDetailScreen from './src/screens/OrderDetail' // 주문내역 상세
import SetDayTimeScreen from './src/screens/SetDayTime' // 영업 운영시간 설정
import SetTimeScreen from './src/screens/SetTime' // 영업 시간 추가
import SetClosedScreen from './src/screens/SetClosed' // 정기 휴일 추가
import SetCloseDayScreen from './src/screens/SetCloseDay' // 휴무일 설정
import SetRestTimeScreen from './src/screens/SetRestTime' // 휴게시간 설정
import SetTipsScreen from './src/screens/SetTips' // 배달팁 설정
import SelectStoreScreen from './src/screens/SelectStore' // 매장선택 및 추가
import CalculateScreen from './src/screens/Calculate' // 정산내역
import ReviewsScreen from './src/screens/Reviews' // 리뷰
import ReviewNoticeScreen from './src/screens/ReviewNotice' // 리뷰 공지사항
import NoticeScreen from './src/screens/Notice/Notice' // 공지사항
import NoticeDetailScreen from './src/screens/Notice/NoticeDetail' // 공지사항 상세 - 웹뷰
import CouponScreen from './src/screens/Coupons/Coupon' // 쿠폰관리
import CouponAddOrEditScreen from './src/screens/Coupons/CouponAddOrEdit' // 쿠폰 추가 또느 수정
import setCategoryScreen from './src/screens/SetCategory' // 메뉴 카테고리 설정(리스트)
import SetMenuScreen from './src/screens/Menus/SetMenu' // 메뉴설정(리스트)
import SetMenuAddOrEditScreen from './src/screens/Menus/SetMenuAddOrEdit' // 메뉴등록 또는 수정
import StoreInfoScreen from './src/screens/StoreInfo' // 매장소개
import StoreSettingScreen from './src/screens/StoreSetting' // 매장설정

const App = () => {
  LogBox.ignoreLogs(['Reanimated 2'])

  const Drawer = createDrawerNavigator()
  const Stack = createStackNavigator()
  // const store = initStore(); 잠시

  const dispatch = useDispatch()

  PushNotification.configure({
    // (optional) Called when Token is generated (iOS and Android)
    onRegister: (token) => {
      console.log('PushNotification onRegister TOKEN:', token)
    },

    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: (notification) => {
      console.log('PushNotification onNotification notification:', notification)

      // process the notification

      // (required) Called when a remote is received or opened, or local notification is opened
      notification.finish(PushNotificationIOS.FetchResult.NoData)
    },

    // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
    onAction: function (notification) {
      console.log('PushNotification onAction ACTION:', notification.action)
      console.log('PushNotification onAction notification:', notification)

      // process the action
    },

    // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
    onRegistrationError: function (err) {
      console.error('PushNotification onRegistrationError', err.message, err)
    },

    // IOS ONLY (optional): default: all - Permissions to register.
    permissions: {
      alert: true,
      badge: true,
      sound: true
    },

    // Should the initial notification be popped automatically
    // default: true
    popInitialNotification: true,

    /**
     * (optional) default: true
     * - Specified if permissions (ios) and token (android and ios) will requested or not,
     * - if not, you must call PushNotificationsHandler.requestPermissions() later
     * - if you are not using remote notification or do not have Firebase installed, use this:
     *     requestPermissions: Platform.OS === 'ios'
     */
    requestPermissions: true
  })

  // 기기토큰 가져오기
  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission({
      alert: true,
      sound: true,
      announcement: false,
      badge: true
    })
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      console.log('Authorization status:', authStatus)
      getToken()
    }
  }

  // const localNoti = () => {
  //   PushNotification.localNotification({
  //     /* Android Only Properties */
  //     channelId: 'dongnaebookowner01', // (required) channelId, if the channel doesn't exist, notification will not trigger.
  //     ticker: 'My Notification Ticker', // (optional)
  //     showWhen: true, // (optional) default: true
  //     autoCancel: true, // (optional) default: true
  //     largeIcon: 'ic_launcher', // (optional) default: "ic_launcher". Use "" for no large icon.
  //     largeIconUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
  //     smallIcon: 'ic_notification', // (optional) default: "ic_notification" with fallback for "ic_launcher". Use "" for default small icon.
  //     bigText: 'My big text that will be shown when notification is expanded', // (optional) default: "message" prop
  //     subText: 'default', // (optional) default: none
  //     bigPictureUrl: 'https://www.example.tld/picture.jpg', // (optional) default: undefined
  //     bigLargeIcon: 'ic_launcher', // (optional) default: undefined
  //     bigLargeIconUrl: 'https://www.example.tld/bigicon.jpg', // (optional) default: undefined
  //     color: 'main', // (optional) default: system default
  //     vibrate: true, // (optional) default: true
  //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
  //     tag: 'some_tag', // (optional) add tag to message
  //     group: 'group', // (optional) add group to message
  //     groupSummary: false, // (optional) set this notification to be the group summary for a group of notifications, default: false
  //     ongoing: false, // (optional) set whether this is an "ongoing" notification
  //     priority: 'high', // (optional) set notification priority, default: high
  //     visibility: 'public', // (optional) set notification visibility, default: private
  //     ignoreInForeground: false, // (optional) if true, the notification will not be visible when the app is in the foreground (useful for parity with how iOS notifications appear). should be used in combine with `com.dieam.reactnativepushnotification.notification_foreground` setting
  //     shortcutId: 'shortcut-id', // (optional) If this notification is duplicative of a Launcher shortcut, sets the id of the shortcut, in case the Launcher wants to hide the shortcut, default undefined
  //     onlyAlertOnce: true, // (optional) alert will open only once with sound and notify, default: false

  //     when: null, // (optional) Add a timestamp (Unix timestamp value in milliseconds) pertaining to the notification (usually the time the event occurred). For apps targeting Build.VERSION_CODES.N and above, this time is not shown anymore by default and must be opted into by using `showWhen`, default: null.
  //     usesChronometer: false, // (optional) Show the `when` field as a stopwatch. Instead of presenting `when` as a timestamp, the notification will show an automatically updating display of the minutes and seconds since when. Useful when showing an elapsed time (like an ongoing phone call), default: false.
  //     timeoutAfter: null, // (optional) Specifies a duration in milliseconds after which this notification should be canceled, if it is not already canceled, default: null

  //     messageId: 'google:message_id', // (optional) added as `message_id` to intent extras so opening push notification can find data stored by @react-native-firebase/messaging module.

  //     actions: ['Yes', 'No'], // (Android only) See the doc for notification actions to know more
  //     invokeApp: true, // (optional) This enable click on actions to bring back the application to foreground or stay in background, default: true

  //     /* iOS only properties */
  //     category: '', // (optional) default: empty string
  //     subtitle: 'My Notification Subtitle', // (optional) smaller title below notification title

  //     /* iOS and Android properties */
  //     id: 0, // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
  //     title: 'hey', // (optional)
  //     message: 'body', // (required)
  //     userInfo: {}, // (optional) default: {} (using null throws a JSON value '<null>' error)
  //     playSound: true, // (optional) default: true
  //     soundName: 'c_sound', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
  //     number: 10, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
  //     repeatType: 'day' // (optional) Repeating interval. Check 'Repeating Notifications' section for more info.
  //   })
  // }

  // Get a FCM Token
  const getToken = async () => {
    const fcmToken = await messaging().getToken().then(token => token)
    if (fcmToken) {
      console.log('FCM ::', fcmToken)
    } else {
      console.log('FCM token is nothing')
    }
  }

  React.useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide()
    }, 1000)

    if (Platform.OS === 'ios') {
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    } else {
      PushNotification.setApplicationIconBadgeNumber(0)
    }

    requestUserPermission()
  }, [])

  React.useEffect(() => {
    if (Platform.OS === 'ios') {
      const type = 'notification'
      PushNotificationIOS.addEventListener(type, onRemoteNotification)
      return () => {
        PushNotificationIOS.removeEventListener(type)
      }
    }
  })

  const onRemoteNotification = (notification) => {
    console.log('ios notification ??', notification)
    const isClicked = notification.getData().userInteraction === 1

    console.log('isClicked ??', isClicked)
    if (isClicked) {
      // Navigate user to another screen
    } else {
      // Do something else with push notification
    }
  }

  // 아이폰은 포그라운드 일때 화면에 푸시를 직접 띄움
  const sendLocalNotificationWithSound = remoteMessage => {
    console.log('remoteMessage ?', remoteMessage)

    if (Platform.OS === 'ios') {
      PushNotificationIOS.addNotificationRequest({
        id: remoteMessage.notification.notificationId
          ? remoteMessage.notification.notificationId
          : new Date().toString(),
        title: remoteMessage.notification.title,
        subtitle: remoteMessage.notification.message
          ? remoteMessage.notification.message
          : '',
        body: remoteMessage.notification.body,
        sound: remoteMessage.notification.sound
      })
    } else {
      PushNotification.localNotification({
        channelId: remoteMessage.notification.android.channelId,
        id: remoteMessage.notification.notificationId
          ? remoteMessage.notification.notificationId
          : new Date().toString(),
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        soundName: remoteMessage.notification.android.sound,
        playSound: true,
        smallIcon: 'ic_stat_ic_notification',
        color: '#FFFFFF',
        largeIcon: '',
        largeIconUrl: '',
        vibrate: true,
        groupSummary: true
      })
    }
  }

  // 신규 주문 들어올 때 redux-saga 호출
  React.useEffect(() => {
    const getMessage = messaging().onMessage(remoteMessage => {
      if (Platform.OS === 'ios') {
        sendLocalNotificationWithSound(remoteMessage)
      }
      dispatch(orderAction.getNewOrder())
    })

    return () => getMessage()
  }, [])

  const toastConfig = {
    custom_type: internalState => (
      <View
        style={{
          width: '90%',
          backgroundColor: '#000000e0',
          borderRadius: 50,
          paddingHorizontal: 16,
          paddingVertical: 17
        }}
      >
        <Text style={{ textAlign: 'center', color: '#fff', fontSize: 11.5 }}>
          {internalState.text1}
        </Text>
      </View>
    )
  }

  const StackNavigator = () => {
    return (
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: 'transparent' },
          cardOverlayEnabled: true,
          cardStyleInterpolator: ({ current: { progress } }) => ({
            cardStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 0.5, 0.9, 1],
                outputRange: [0, 0.25, 0.7, 1]
              })
            },
            overlayStyle: {
              opacity: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.5],
                extrapolate: 'clamp'
              })
            }
          })
        }}
      >
        <Stack.Screen name='Check' component={CheckScreen} />
        <Stack.Screen name='Login' component={LoginScreen} />
        <Stack.Screen name='FindId' component={FindIdScreen} />
        <Stack.Screen name='FindPwd' component={FindPwdScreen} />
        <Stack.Screen name='SetNewPwd' component={SetNewPwdScreen} />
        <Stack.Screen name='Main' component={MainScreen} />
        <Stack.Screen name='CancelOrders' component={CancelOrdersScreen} />
        <Stack.Screen name='SelectStore' component={SelectStoreScreen} />
        <Stack.Screen name='OrderDetail' component={OrderDetailScreen} />
        <Stack.Screen name='SetDayTime' component={SetDayTimeScreen} />
        <Stack.Screen name='SetTime' component={SetTimeScreen} />
        <Stack.Screen name='SetClosed' component={SetClosedScreen} />
        <Stack.Screen name='SetCloseDay' component={SetCloseDayScreen} />
        <Stack.Screen name='SetRestTime' component={SetRestTimeScreen} />
        <Stack.Screen name='SetTips' component={SetTipsScreen} />
        <Stack.Screen name='Calculate' component={CalculateScreen} />
        <Stack.Screen name='Reviews' component={ReviewsScreen} />
        <Stack.Screen name='ReviewNotice' component={ReviewNoticeScreen} />
        <Stack.Screen name='Notice' component={NoticeScreen} />
        <Stack.Screen name='NoticeDetail' component={NoticeDetailScreen} />
        <Stack.Screen name='Coupon' component={CouponScreen} />
        <Stack.Screen name='CouponAddOrEdit' component={CouponAddOrEditScreen} />
        <Stack.Screen name='setCategory' component={setCategoryScreen} />
        <Stack.Screen name='SetMenu' component={SetMenuScreen} />
        <Stack.Screen name='SetMenuAddOrEdit' component={SetMenuAddOrEditScreen} />
        <Stack.Screen name='StoreInfo' component={StoreInfoScreen} />
        <Stack.Screen name='StoreSetting' component={StoreSettingScreen} />
      </Stack.Navigator>
    )
  }

  return (
    <>
      <StatusBar
        translucent
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'light-content'}
        backgroundColor='#1543F5'
        hidden={Platform.OS !== 'ios'}
      />

      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName='Home'
          screenOptions={{
            headerShown: false,
            drawerPosition: 'right',
            drawerType: 'front',
            drawerStyle: { width: '100%', height: Dimensions.get('window').height },
            overlayColor: 'rgba(0,0,0,0.7)',
            gestureEnabled: false,
            swipeEnabled: false
          }}
          drawerContent={props => <DrawerMenu {...props} />}
        >
          <Drawer.Screen name='Home' component={StackNavigator} />
        </Drawer.Navigator>
      </NavigationContainer>
      <Toast config={toastConfig} topOffset={10} ref={ref => Toast.setRef(ref)} />
    </>
  )
}

export default App
