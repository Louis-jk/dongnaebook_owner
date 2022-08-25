import * as React from 'react'
import { View, PermissionsAndroid, Platform, ToastAndroid, BackHandler } from 'react-native'
import Header from '../components/Headers/DefaultHeader'
import TabView from '../components/TabView'
import { useSelector, useDispatch } from 'react-redux'
import * as storeAction from '../redux/actions/storeAction'
import Api from '../Api'

const Main = props => {
  const { navigation } = props
  const dispatch = useDispatch()

  const { mt_id: mtId } = useSelector(state => state.login)

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
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const getStoreHandler = () => {
    const param = {
      jumju_id: mtId,
      item_count: 0,
      limit_count: 10
    }

    Api.send('store_jumju', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        const initialSelectStore = arrItems.filter(store => store.mt_id === mtId)

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
  }

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

      return () => requestAndroidPermission()
    }
    getStoreHandler()

    return () => getStoreHandler()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} />
      <TabView navigation={navigation} />
    </View>
  )
}

export default Main
