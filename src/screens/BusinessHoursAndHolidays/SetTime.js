import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Keyboard
} from 'react-native'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import { useSelector, useDispatch } from 'react-redux'
import Api from '../../Api'
import * as storeTimeAction from '../../redux/actions/storeTimeAction'
import cusToast from '../../components/CusToast'
import { TextInput } from 'react-native-gesture-handler'
import { useDrawerStatus } from '@react-navigation/drawer'
import { weekData } from '../../data/week'
import Divider from '../../components/Divider'

const SetTime = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const [existWeek, setExistWeek] = React.useState([])

  const dispatch = useDispatch()
  const isDrawerOpen = useDrawerStatus() === 'open' // 드로어 펼침 여부 체킹

  const [selectDay, setSelectDay] = React.useState([])
  const selectDayHandler = payload => {
    const filtered = selectDay.find(day => day === payload)

    if (!filtered) {
      setSelectDay([...new Set([...selectDay, payload])])
    } else {
      const removeObj = selectDay.filter(day => day !== payload)
      setSelectDay(removeObj)
    }
  }

  // 데이트 셀렉터
  const [startTimeHour, setStartTimeHour] = React.useState('00') // 시작시간
  const [startTimeMinute, setStartTimeMinute] = React.useState('00') // 시작시간
  const [endTimeHour, setEndTimeHour] = React.useState('00') // 마감시간
  const [endTimeMinute, setEndTimeMinute] = React.useState('00') // 마감시간

  React.useEffect(() => {
    if (isDrawerOpen) {
      Keyboard.dismiss()
      return () => Keyboard.dismiss()
    }
  }, [isDrawerOpen])

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

      if (resultItem.result === 'Y') {
        console.log('store Service hour arrItems', arrItems)

        const result = arrItems.reduce((acc, curr, i) => {
          const toArr = curr.st_yoil.split(',')
          acc.push(toArr)
          return acc
        }, [])

        const flatArr = result.flat(Infinity)
        const flatArrSort = flatArr.sort()
        setExistWeek(flatArrSort)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      } else {
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      }
    })
  }

  const setStoreTimeHandler = () => {
    const selectDayFormat = selectDay.join()

    if (selectDay === null || selectDay === '' || selectDay.length === 0) {
      cusToast('요일을 선택해주세요.')
    } else {
      const start = `${startTimeHour}:${startTimeMinute}`
      const end = `${endTimeHour}:${endTimeMinute}`

      // return false;

      console.log('start 시간', start)
      console.log('end 시간', end)
      const param = {
        encodeJson: true,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        mode: 'update',
        st_yoil: selectDayFormat,
        st_stime: start,
        st_etime: end
      }
      Api.send('store_service_hour', param, args => {
        const resultItem = args.resultItem
        // const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          getStoreTimeHandler()
          cusToast('영업시간을 추가하였습니다.')
        } else {
          cusToast('영업시간을 추가하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.')
        }

        setTimeout(() => {
          navigation.navigate('Home', { screen: 'SetDayTime' })
        }, 1500)
      })
    }
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getStoreTimeHandler()
    }
    return () => {
      isSubscribed = false
    }
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='영업 시간 추가' type='save' />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>

        <Divider />
        <View style={{ ...BaseStyle.mb10 }} />

        {/* 영업시간 */}
        <View
          style={{
            ...BaseStyle.ph20,
            ...BaseStyle.mv10,
            flex: 1,
            flexDirection: 'row',
            width: '100%'
          }}
        >
          {weekData.map((day, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={() => {
                if (existWeek.includes(day.idx)) {
                  cusToast('이미 등록된 요일입니다.')
                  return false
                } else {
                  selectDayHandler(day.idx)
                }
              }}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: Dimensions.get('window').width / 9.8,
                height: Dimensions.get('window').width / 9.8,
                borderRadius: Dimensions.get('window').width / 9.8,
                backgroundColor: existWeek.includes(day.idx)
                  ? '#efefef'
                  : selectDay.includes(day.idx)
                    ? Primary.PointColor01
                    : '#fff',
                borderWidth: 1,
                borderColor: existWeek.includes(day.idx)
                  ? '#efefef'
                  : selectDay.includes(day.idx)
                    ? Primary.PointColor01
                    : '#E3E3E3',
                marginLeft: index !== 0 ? 10 : 0
              }}
            >
              <Text
                style={{
                  color: existWeek.includes(day.idx)
                    ? '#fff'
                    : selectDay.includes(day.idx)
                      ? '#fff'
                      : '#222'
                }}
              >
                {day.ko}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* //영업시간 */}

        <View style={{ ...BaseStyle.ph20 }}>
          <View
            style={{
              height: 1,
              width: '100%',
              backgroundColor: '#E3E3E3',
              ...BaseStyle.mv10,
              ...BaseStyle.mb20
            }}
          />
          <View>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              시작시간
            </Text>

            <View style={{ ...BaseStyle.container, ...BaseStyle.mb10, width: 200 }}>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextInput
                  value={startTimeHour}
                  placeHolder='00'
                  onChangeText={text => {
                    const re = /^[0-9\b]{0,2}$/
                    console.log('startTimeHour text type', typeof text)
                    if (re.test(text) && text < 24) {
                      const val = text.toString()
                      setStartTimeHour(val)
                    }
                  }}
                  keyboardType='number-pad'
                  onFocus={() => setStartTimeHour('')}
                  onBlur={() => {
                    if (startTimeHour === '0') {
                      const val = '0' + startTimeHour
                      setStartTimeHour(val)
                    }

                    if (!startTimeHour.startsWith('0') && Number(startTimeHour) < 10) {
                      if (Number(startTimeHour) > 0) {
                        const val = '0' + startTimeHour
                        setStartTimeHour(val)
                      } else {
                        setStartTimeHour('00')
                      }
                    }
                  }}
                />
              </View>
              <Text style={{ ...BaseStyle.mh10, ...BaseStyle.ko20 }}>:</Text>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextInput
                  value={startTimeMinute}
                  placeHolder='00'
                  onChangeText={text => {
                    const re = /^[0-9\b]{0,2}$/
                    console.log(typeof text)
                    if (startTimeHour !== '24') {
                      if (re.test(text) && text < 60) {
                        const val = text.toString()
                        setStartTimeMinute(val)
                      }
                    } else {
                      setStartTimeMinute('00')
                    }
                  }}
                  keyboardType='number-pad'
                  onFocus={() => setStartTimeMinute('')}
                  onBlur={() => {
                    if (startTimeMinute === '0') {
                      const val = '0' + startTimeMinute
                      setStartTimeMinute(val)
                    }
                    if (!startTimeMinute.startsWith('0') && Number(startTimeMinute) < 10) {
                      if (Number(startTimeMinute) > 0) {
                        const val = '0' + startTimeMinute
                        setStartTimeMinute(val)
                      } else {
                        setStartTimeMinute('00')
                      }
                    }
                  }}
                />
              </View>
            </View>

            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb30, color: Primary.PointColor02 }}>
              상단 박스를 눌러 시작시간을 설정해주세요.
            </Text>

            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              마감시간
            </Text>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb10, width: 200 }}>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextInput
                  value={endTimeHour}
                  placeHolder='00'
                  onChangeText={text => {
                    const re = /^[0-9\b]{0,2}$/
                    console.log(typeof text)
                    if (re.test(text) && text < 24) {
                      const val = text.toString()
                      setEndTimeHour(val)
                    }
                  }}
                  keyboardType='number-pad'
                  onFocus={() => setEndTimeHour('')}
                  onBlur={() => {
                    if (endTimeHour === '0') {
                      const val = '0' + endTimeHour
                      setEndTimeHour(val)
                    }
                    if (!endTimeHour.startsWith('0') && Number(endTimeHour) < 10) {
                      if (Number(endTimeHour) > 0) {
                        const val = '0' + endTimeHour
                        setEndTimeHour(val)
                      } else {
                        setEndTimeHour('00')
                      }
                    }
                  }}
                />
              </View>
              <Text style={{ ...BaseStyle.mh10, ...BaseStyle.ko20 }}>:</Text>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <TextInput
                  value={endTimeMinute}
                  placeHolder='00'
                  onChangeText={text => {
                    const re = /^[0-9\b]{0,2}$/
                    console.log(typeof text)
                    if (re.test(text) && text < 60) {
                      const val = text.toString()
                      setEndTimeMinute(val)
                    }
                  }}
                  keyboardType='number-pad'
                  onFocus={() => setEndTimeMinute('')}
                  onBlur={() => {
                    if (endTimeMinute === '0') {
                      const val = '0' + endTimeMinute
                      setEndTimeMinute(val)
                    }
                    if (!endTimeMinute.startsWith('0') && Number(endTimeMinute) < 10) {
                      if (Number(endTimeMinute) > 0) {
                        const val = '0' + endTimeMinute
                        setEndTimeMinute(val)
                      } else {
                        setEndTimeMinute('00')
                      }
                    }
                  }}
                />
              </View>
            </View>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb30, color: Primary.PointColor02 }}>
              상단 박스를 눌러 마감시간을 설정해주세요.
            </Text>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setStoreTimeHandler()}
        style={{ ...BaseStyle.mainBtnBottom }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
          저장하기
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SetTime
