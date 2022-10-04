import * as React from 'react'
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
  Platform
} from 'react-native'
import BaseStyle from '../styles/Base'
import { useDispatch, useSelector } from 'react-redux'
import * as storeAction from '../redux/actions/storeAction'
import * as loginAction from '../redux/actions/loginAction'
import Api from '../Api'
import Divider from '../components/Divider'
import AnimateLoading from '../components/Loading/AnimateLoading'


const LIMIT = 5;

const SelectStore = props => {
  const { navigation } = props

  const dispatch = useDispatch()
  const { allStore, selectedStore } = useSelector(state => state.store)
  const { mt_store: mtStore, mt_app_token: mtAppToken } = useSelector(state => state.login)
  const [storeData, setStoreData] = React.useState([]);
  const [offset, setOffset] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  
  const storeDataArrayHandler = () => {    
    
    if(allStore > storeData) {
      setLoading(true)
      
      setStoreData(storeData.concat(allStore.slice(offset, offset + LIMIT)))
      setOffset(offset + LIMIT)

      setLoading(false)
    }
  }

  React.useEffect(() => {
    if(allStore && allStore.length > 0) {
      storeDataArrayHandler()

      return () => storeDataArrayHandler()
    }
  }, [allStore])

  const onEndReached = () => {    
    if(loading) {
      return
    } else {
      storeDataArrayHandler()
    }
  }

  console.log('====================================');
  console.log("allStore length ??", allStore.length);
  console.log("storeData length ??", storeData.length);
  console.log("storeData ??", storeData);
  console.log("offset ??", offset);
  console.log('====================================');

  function setStoreHandler (item, id, jumjuId, jumjuCode, store, addr) {
    dispatch(storeAction.selectStore(id, jumjuId, jumjuCode, store, addr))
    dispatch(loginAction.updateLogin(JSON.stringify(item)))
    dispatch(loginAction.updateToken(JSON.stringify(mtAppToken)))

    const param = {
      mt_id: jumjuId,
      mt_app_token: mtAppToken
    }

    Api.send('store_login_token', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        console.log('토큰 업데이트 실행 결과 ::: ', arrItems)
      } else {
        console.log('토큰 업데이트 실패')
      }
    })
    // navigation.navigate('Home', {screen:'Main'});
  }

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const renderRow = ({ item, index }) => {
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            setStoreHandler(
              item,
              item.id,
              item.mt_id,
              item.mt_jumju_code,
              item.mt_store,
              item.mt_addr
            )}
          style={{ ...BaseStyle.mv20, ...BaseStyle.pv5, ...BaseStyle.container5 }}
        >
          <View style={{ width: '80%' }}>
            <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
              {item.mt_store}
            </Text>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh22 }}>{item.mt_addr}</Text>
          </View>
          <Image
            source={
              selectedStore.id === item.id
                ? require('../images/ic_check_on.png')
                : require('../images/ic_check_off.png')
            }
            style={{ width: 20, height: 20 }}
          />
        </TouchableOpacity>

        <Divider />
      </View>
    )
  }

  

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} testID='selectStoreScreen'>
      <View
        style={{
          ...BaseStyle.container5,
          ...BaseStyle.ph20,
          paddingVertical: Platform.OS === 'ios' ? 10 : 20,
          backgroundColor: '#fff'
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>매장 선택</Text>
        </View>

        <TouchableOpacity
          testID='clsBtn'
          activeOpacity={1}
          onPress={() => navigation.navigate('Home', { screen: 'Main' })}
          hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Image
            source={require('../images/pop_close_bk.png')}
            style={{ width: 22, height: 22 }}
            resizeMode='contain'
          />
        </TouchableOpacity>
      </View>

      <Divider />

      {loading && <AnimateLoading description='' />}
      
      {!loading && 
        <View style={{ flex: 1, ...BaseStyle.ph20 }}>
          <FlatList
            bounces={false}
            data={storeData}
            renderItem={renderRow}
            keyExtractor={(list, index) => index.toString()}
            persistentScrollbar
            showsVerticalScrollIndicator={false}
            refreshing
            onEndReached={onEndReached}
            onEndReachedThreshold={0.6}
            style={{ backgroundColor: '#fff', width: '100%' }}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: Dimensions.get('window').height - 300
                }}
              >
                <Text style={{ ...BaseStyle.ko15, textAlign: 'center', ...BaseStyle.mb10 }}>
                  <Text
                    style={{
                      ...BaseStyle.ko18,
                      ...BaseStyle.font_bold,
                      textAlign: 'center',
                      ...BaseStyle.mb10
                    }}
                  >
                    {mtStore}
                  </Text>{' '}
                  외에
                </Text>
                <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
                  아직 등록된 매장이 없습니다.
                </Text>
              </View>
            }
          />
          {/* 매장 추가 신청 버튼 */}
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => alert('hi')}
            style={{...BaseStyle.mainBtn, ...BaseStyle.inputH, ...BaseStyle.mv20}}>
            <View style={{...BaseStyle.container0}}>
              <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.mr10}}>
                  매장 추가 신청
              </Text>
              <Image
                source={require('../images/plus.png')}
                style={{width: 18, height: 18}}
                resizeMode="contain"
              />
            </View>
          </TouchableOpacity> */}
          {/* // 매장 추가 신청 버튼 */}
        </View>
      }
    </SafeAreaView>
  )
}

export default SelectStore
