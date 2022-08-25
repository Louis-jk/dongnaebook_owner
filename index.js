import React from 'react'
import { AppRegistry, Text, TextInput, Platform, LogBox } from 'react-native'
import App from './App'
import { name as appName } from './app.json'

import messaging from '@react-native-firebase/messaging'
import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Provider } from 'react-redux'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import initStore from './src/redux/store'

LogBox.ignoreLogs(['Remote debugger'])

Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.allowFontScaling = false
TextInput.defaultProps = TextInput.defaultProps || {}
TextInput.defaultProps.allowFontScaling = false

// Register background handler // app closed & background 일때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage)
  if (Platform.OS === 'ios') {
    PushNotificationIOS.getApplicationIconBadgeNumber(function (number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number + 1)
    })
  }
})

async function registerAppWithFCM () {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages()
  }
}

// FCM 퍼미션 체크
async function requestUserPermission () {
  const authStatus = await messaging().requestPermission()

  if (authStatus) {
    console.log('Permission settings:', authStatus)
    const fcmToken = await messaging().getToken()
    if (fcmToken) {
      console.log('Firebase push Token is:', fcmToken)
    }
  }
}
registerAppWithFCM()
requestUserPermission()

const store = initStore()
const queryClient = new QueryClient()

const RNRedux = () => (
  <QueryClientProvider client={queryClient}>
    <Provider store={store}>
      <App />
    </Provider>
  </QueryClientProvider>
)

AppRegistry.registerComponent(appName, () => RNRedux)
