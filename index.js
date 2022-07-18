/**
 * @format
 */
import React from 'react';
import {AppRegistry, Text, TextInput, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {Provider} from 'react-redux';
import initStore from './src/redux/store';

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;
TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.allowFontScaling = false;

// Register background handler // app closed & background 일때
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (Platform.OS === 'ios') {
    PushNotificationIOS.getApplicationIconBadgeNumber(function (number) {
      PushNotificationIOS.setApplicationIconBadgeNumber(number + 1);
    });
  }
});

async function registerAppWithFCM() {
  if (!messaging().isDeviceRegisteredForRemoteMessages) {
    await messaging().registerDeviceForRemoteMessages();
  }
}
async function requestUserPermission() {
  const settings = await messaging().requestPermission();

  if (settings) {
    console.log('Permission settings:', settings);
  }
}
registerAppWithFCM();
requestUserPermission();

// function HeadlessCheck({ isHeadless }) {
//   if (isHeadless) {
//     // App has been launched in the background by iOS, ignore
//     return null;
//   }

//   return <App />;
// }

const store = initStore();

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => RNRedux);
