import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Api from '../../Api'
import BaseStyle from '../../styles/Base'
import * as regHolidayAction from '../../redux/actions/regularHolidayAction'

const StoreRegularHoliday = props => {
  const navigation = props.navigation
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const { st_yoil: stYoil, st_yoil_txt: stYoilTxt, st_week: stWeek } = useSelector(state => state.regularHoliday)

  const [isLoading, setLoading] = React.useState(false)
  const [storeRHoliday, setStoreRHoliday] = React.useState(null) // 정기휴일

  const dispatch = useDispatch()

  const getStoreRegularHoliday = () => {
    setLoading(true)

    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'list'
    }
    Api.send('store_regular_hoilday', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        // setStoreRHoliday(arrItems);
        dispatch(regHolidayAction.updateRegularHoliday(JSON.stringify(arrItems[0])))
        setLoading(false)
      } else {
        dispatch(
          regHolidayAction.updateRegularHoliday(
            JSON.stringify({
              st_yoil: null,
              st_yoil_txt: null,
              st_week: null
            })
          )
        )
        setLoading(false)
      }
    })
  }

  const delStoreRegularHoliday = () => {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'delete'
    }
    Api.send('store_regular_hoilday', param, args => {
      // let resultItem = args.resultItem;
      // let arrItems = args.arrItems;

      dispatch(
        regHolidayAction.updateRegularHoliday(
          JSON.stringify({
            st_yoil: null,
            st_yoil_txt: null,
            st_week: null
          })
        )
      )
      getStoreRegularHoliday()
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStoreRegularHoliday()
    })
    return unsubscribe
  }, [navigation])

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>정기휴일</Text>
      </View>

      <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv15 }}>
        {/* 정기휴일 리스트 */}
        {stWeek && stYoilTxt && (
          <View style={{ ...BaseStyle.container5, ...BaseStyle.mv10 }}>
            <View style={{ ...BaseStyle.container }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
                {stWeek}
              </Text>
              <Text style={{ ...BaseStyle.ko14 }}>{stYoilTxt}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                Alert.alert(
                  '해당 정기휴일을 삭제하시겠습니까?',
                  '삭제하시면 복구하실 수 없습니다.',
                  [
                    {
                      text: '예',
                      onPress: () => delStoreRegularHoliday()
                    },
                    {
                      text: '아니오'
                    }
                  ]
                )}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Image
                source={require('../../images/popup_close.png')}
                style={{ width: 18, height: 18, borderRadius: 18, opacity: 0.5 }}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
        )}
        {!stWeek && !stYoilTxt && (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              ...BaseStyle.mv15
            }}
          >
            <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
              아직 등록된 정기휴일이 없습니다.
            </Text>
          </View>
        )}
        {/* // 정기휴일 리스트 */}
        {stWeek && stYoilTxt && (
          <View style={{ ...BaseStyle.disableBtn, ...BaseStyle.mv10 }}>
            <Text
              style={{
                ...BaseStyle.ko15,
                ...BaseStyle.font_bold,
                ...BaseStyle.font_222
              }}
            >
              정기휴일 추가완료
            </Text>
          </View>
        )}
        {!stWeek && !stYoilTxt && (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Home', { screen: 'SetClosed' })}
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
              정기휴일 추가
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* } */}
    </SafeAreaView>
  )
}

export default StoreRegularHoliday
