import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
  Keyboard
} from 'react-native'
import Modal from 'react-native-modal'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useSelector, useDispatch } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import Api from '../Api'
import * as storeTimeAction from '../redux/actions/storeTimeAction'
import cusToast from '../components/CusToast'
import Base from '../styles/Base'
import { TextInput, TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { useDrawerStatus } from '@react-navigation/drawer'

const SetTime = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const [existWeek, setExistWeek] = React.useState([])

  const dispatch = useDispatch()
  const isDrawerOpen = useDrawerStatus() === 'open'

  console.log('navigation ?', navigation)
  console.log('navigation getState?', navigation.getState())
  console.log('navigation isFocused?', navigation.isFocused())
  console.log('isDrawerOpen ?', isDrawerOpen)

  // 주일
  const weekData = [
    {
      idx: '0',
      en: 'sun',
      ko: '일'
    },
    {
      idx: '1',
      en: 'mon',
      ko: '월'
    },
    {
      idx: '2',
      en: 'tue',
      ko: '화'
    },
    {
      idx: '3',
      en: 'wed',
      ko: '수'
    },
    {
      idx: '4',
      en: 'thu',
      ko: '목'
    },
    {
      idx: '5',
      en: 'fri',
      ko: '금'
    },
    {
      idx: '6',
      en: 'sat',
      ko: '토'
    }
  ]

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
        // console.log('flatArrSort', flatArrSort);
        setExistWeek(flatArrSort)

        // arrItems.filter(el => el.st_yo)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      } else {
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      }
    })
  }

  const setStoreTimeHandler = () => {
    const selectDayFormat = selectDay.join()
    // let startTimeFormat = moment(startTime).format("h:mm");
    // let endTimeFormat = moment(endTime).format("h:mm");

    if (selectDay === null || selectDay === '' || selectDay.length === 0) {
      cusToast('요일을 선택해주세요.')
    }
    //  else if (startTime >= endTime) {
    //   cusToast("시작시간은 마감시간 이전 시간이어야합니다.");
    // } else if (endTime <= startTime) {
    //   cusToast("마감시간은 시작시간 이후 시간이어야합니다.");
    // }
    else {
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
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          getStoreTimeHandler()
          Alert.alert('영업시간을 추가하였습니다.', '리스트로 이동합니다.', [
            {
              text: '확인',
              onPress: () => navigation.navigate('Home', { screen: 'SetDayTime' })
            }
          ])
        } else {
          Alert.alert('영업시간을 추가할 수 없습니다.', '다시 한번 시도해주세요.', [
            {
              text: '확인',
              onPress: () => navigation.navigate('Home', { screen: 'SetDayTime' })
            }
          ])
        }
      })
    }
  }

  React.useEffect(() => {
    getStoreTimeHandler()
    return () => getStoreTimeHandler()
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='영업 시간 추가' type='save' />
      {/* <StatusMenu navigation={navigation} /> */}

      <ScrollView>
        <View style={{ height: 1, width: '100%', ...BaseStyle.mb10 }} />

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

        {/* 24시간 운영 */}
        {/* <View style={{...BaseStyle.ph20, ...BaseStyle.mb20}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => toggleCheckAllTimeHandler()}
            style={{
              ...BaseStyle.container,
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Image
              source={
                allTime ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')
              }
              style={{width: 20, height: 20, ...BaseStyle.mr10}}
              resizeMode="cover"
            />
            <Text style={{...BaseStyle.ko14}}>24시간 운영</Text>
          </TouchableOpacity>
        </View> */}
        {/* // 24시간 운영 */}
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
