import * as React from 'react';
import { View, PermissionsAndroid, Platform, ToastAndroid, BackHandler } from 'react-native';
import Header from '../components/DefaultHeader';
import TabView from '../components/TabView';
import { useSelector, useDispatch } from 'react-redux';
import * as storeAction from '../redux/actions/storeAction';
import * as loginAction from '../redux/actions/loginAction';

// import StoreList from '../components/StoreList';
// import StoreList from '../components/StoreList';
import Api from '../Api';

// import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification, { Importance } from 'react-native-push-notification';

const Main = props => {
  const { navigation } = props
  const dispatch = useDispatch()
  const { allStore, selectedStore } = useSelector(state => state.store)
  const [channerId, setChannelId] = React.useState('')
  const { mt_id } = useSelector(state => state.login)

  let currentCount = 0

  const backAction = () => {
    if (currentCount < 1) {
      ToastAndroid.show('한번 더 누르면 앱을 종료합니다.', ToastAndroid.SHORT)
      console.log('0에 해당')
      currentCount++
    } else {
      console.log('1에 해당')
      BackHandler.exitApp()
    }

    setTimeout(() => {
      currentCount = 0
    }, 2000)

    return true
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const getStoreHandler = () => {
    const param = {
      jumju_id: mt_id,
      item_count: 0,
      limit_count: 10
    }

    Api.send('store_jumju', param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        const initialSelectStore = arrItems.filter(store => store.mt_id === mt_id)

        dispatch(dispatch(storeAction.updateStore(arrItems)))
        dispatch(
          dispatch(
            storeAction.selectStore(
              initialSelectStore[0].id,
              initialSelectStore[0].mt_jumju_id,
              initialSelectStore[0].mt_jumju_code,
              initialSelectStore[0].mt_store,
              initialSelectStore[0].mt_addr
            )
          )
        )
      }
    })
  };

  // 안드로이드 권한 설정
  const requestAndroidPermission = async () => {
    try {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.CAMERA,
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        // PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
      ])

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the camera')
      } else {
        console.log('Camera permission denied')
      }
    } catch (err) {
      console.warn(err)
    }
  }

  React.useEffect(() => {
    if (Platform.OS === 'android') {
      requestAndroidPermission()
    }
    getStoreHandler()
  }, [])

  // React.useEffect(() => {
  //   if(allStore.length < 1) {
  //     Alert.alert('매장을 등록해주세요.');
  //   }
  //   if(selectedStore.id === null || selectedStore.name === null) {
  //     Alert.alert('매장을 선택해주세요.', '매장 선택 페이지로 이동합니다.', [
  //       {
  //         text: '확인',
  //         onPress: () => navigation.navigate('SelectStore')
  //       }
  //     ]);
  //   }
  // });

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} />
      <TabView navigation={navigation} />
    </View>
  )
};

export default Main
