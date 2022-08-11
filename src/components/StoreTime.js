import React from 'react'
import { View, Text, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Api from '../Api'
import BaseStyle from '../styles/Base'
import * as storeTimeAction from '../redux/actions/storeTimeAction'
import AnimateLoading from './AnimateLoading'
import cusToast from './CusToast'

const StoreTime = props => {
  const navigation = props.navigation
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const { storeTime } = useSelector(state => state.storeTime)

  const [isLoading, setLoading] = React.useState(false)
  const [storeTimeList, setStoreTimeList] = React.useState(null) // 영업시간

  const dispatch = useDispatch()

  const getStoreTimeHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'list'
    }
    Api.send('store_service_hour', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      console.log('resultItem', resultItem)

      if (resultItem.result === 'Y') {
        setStoreTimeList(arrItems)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      } else {
        setStoreTimeList(null)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      }

      setLoading(false)
    })
  }

  function delStoreTimeHandler (payload) {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      st_idx: payload,
      mode: 'delete'
    }
    Api.send('store_service_hour', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getStoreTimeHandler()
      } else {
        cusToast('영업시간을 삭제할 수 없습니다.\n다시 한번 확인해주세요.', 2500)
        // Alert.alert('영업시간을 삭제할 수 없습니다.', '다시 한번 확인해주세요.', [
        //   {
        //     text: '확인'
        //   }
        // ])
      }
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStoreTimeHandler()
    })
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>영업시간</Text>
      </View>

      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading && (
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv15 }}>
          {/* 영업시간 리스트 */}
          {storeTime &&
            storeTime.map((item, index) => (
              <View key={item.st_idx} style={{ ...BaseStyle.container5, ...BaseStyle.mv10 }}>
                <View style={{ ...BaseStyle.container }}>
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
                    {item.st_yoil_txt}
                  </Text>
                  <Text style={{ ...BaseStyle.ko14 }}>{`${item.st_stime} ~ ${item.st_etime}`}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() =>
                    Alert.alert(
                      '해당 영업시간을 삭제하시겠습니까?',
                      '삭제하시면 복구하실 수 없습니다.',
                      [
                        {
                          text: '예',
                          onPress: () => delStoreTimeHandler(item.st_idx)
                        },
                        {
                          text: '아니오'
                        }
                      ]
                    )}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                >
                  <Image
                    source={require('../images/popup_close.png')}
                    style={{ width: 18, height: 18, borderRadius: 18, opacity: 0.5 }}
                    resizeMode='cover'
                  />
                </TouchableOpacity>
              </View>
            ))}
          {/* // 영업시간 리스트 */}

          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Home', { screen: 'SetTime' })}
            style={{ ...BaseStyle.mainBtn, ...BaseStyle.mv10 }}
          >
            <Text
              style={{
                ...BaseStyle.ko15,
                ...BaseStyle.font_bold,
                ...BaseStyle.font_222,
                ...BaseStyle.textWhite
              }}
            >
              영업시간 추가
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  )
}

export default StoreTime
