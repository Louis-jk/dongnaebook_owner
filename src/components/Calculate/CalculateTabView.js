import * as React from 'react'
import { View, Text, TouchableOpacity, Image, Platform, Alert } from 'react-native'
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import BaseStyle, { Primary, customPickerStyles } from '../../styles/Base'
import RNPickerSelect from 'react-native-picker-select' // 셀렉트박스 패키지
import DateTimePicker from '@react-native-community/datetimepicker'
import CalculateList from './CalculateList'
import moment from 'moment'
import 'moment/locale/ko'
import { monthArr } from '../../data/month'
import { data } from '../../data/calcMockData'
import cusToast from '../CusToast'
import { isHigherException, isLowerException } from '../../modules/dateCheck'

const Tab = createMaterialTopTabNavigator()

const CalculateTabView = () => {
  const Month = () => {
    const [selectedYear, setSelectedYear] = React.useState('') // 년 선택
    const [currentYear, setCurrentYear] = React.useState('') // 현재 년
    const [selectedMonth, setSelectedMonth] = React.useState('') // 월 선택
    const [currentMonth, setCurrentMonth] = React.useState('') // 현재 월

    // 년도 배열 만들기
    const [yearArr, setYearArr] = React.useState([])
    function getYearRangeHandler (param1, param2) {
      const arr = []

      const start = param1
      const end = param2

      let i = start
      for (i; i <= end; i++) {
        // arr.push(i);
        arr.push({
          label: i + '년',
          value: i
        })
      }

      setYearArr(arr)
    }

    const initialSelectedYear = payload => {
      setCurrentYear(payload)
      setSelectedYear(payload)
    }

    const initialSelectedMonth = payload => {
      setCurrentMonth(payload)
      setSelectedMonth(payload)
    }

    const checkMonthSelector = (selectMonth) => {
      if (selectedYear === currentYear && selectMonth > currentMonth) {
        cusToast('아직 데이터가 없습니다.')
        let prev = selectedMonth
        setSelectedMonth(prev)
      } else {
        setSelectedMonth(selectMonth)
      }
    }

    function initCurrentDate () {
      const getNow = new Date()
      const getNowYear = getNow.getFullYear()
      const getNowMonth = getNow.getMonth() + 1

      // getStatisticsAPI();
      getYearRangeHandler(2021, getNowYear)
      initialSelectedYear(getNowYear)
      initialSelectedMonth(getNowMonth)
    }

    React.useEffect(() => {
      initCurrentDate()

      return () => initCurrentDate()
    }, [])

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', ...BaseStyle.ph20 }}>
        <View style={{ ...BaseStyle.container5, ...BaseStyle.pv20 }}>
          <View style={{ marginRight: 5, flex: 1.5 }}>
            <RNPickerSelect
              fixAndroidTouchableBug
              value={selectedYear}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: '선택해주세요.', value: null }}
              onValueChange={value => setSelectedYear(value)}
              items={yearArr}
              style={{
                ...customPickerStyles,
                justifyContent: 'center',
                alignItems: 'flex-start',
                ...BaseStyle.border,
                ...BaseStyle.inputH,
                backgroundColor: '#fff',
                ...BaseStyle.pl20,
                placeholder: {
                  color: '#888'
                }
              }}
              Icon={() => {
                return (
                  <Image
                    source={require('../../images/ic_select.png')}
                    style={[
                      Platform.OS === 'ios' && {
                        position: 'absolute',
                        top: 20,
                        right: 10
                      },
                      {
                        width: Platform.OS === 'android' ? 50 : 25,
                        height: Platform.OS === 'android' ? 50 : 10
                      }
                    ]}
                    resizeMode={Platform.OS === 'android' ? 'center' : 'contain'}
                  />
                )
              }}
            />
          </View>
          <View style={{ marginRight: 5, flex: 1.5 }}>
            <RNPickerSelect
              fixAndroidTouchableBug
              value={selectedMonth}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: '선택해주세요.', value: null }}
              onValueChange={value => {
                console.log('바꾼 월 ::', value)
                console.log('선택 월 ::', selectedMonth)
                console.log('현재 월 ::', currentMonth)
                console.log('선택 년 ::', selectedYear)
                console.log('현재 년 ::', currentYear)
                console.log('------------------------')

                if (selectedYear === currentYear && value > currentMonth) {
                  cusToast('아직 데이터가 없습니다.')
                  setSelectedMonth(selectedMonth)
                } else {
                  setSelectedMonth(value)
                }
              }}
              items={monthArr}
              style={{
                ...customPickerStyles,
                justifyContent: 'center',
                alignItems: 'flex-start',
                ...BaseStyle.border,
                ...BaseStyle.inputH,
                backgroundColor: '#fff',
                ...BaseStyle.pl20,
                placeholder: {
                  color: '#888'
                }
              }}
              Icon={() => {
                return (
                  <Image
                    source={require('../../images/ic_select.png')}
                    style={[
                      Platform.OS === 'ios' && {
                        position: 'absolute',
                        top: 20,
                        right: 10
                      },
                      {
                        width: Platform.OS === 'android' ? 50 : 25,
                        height: Platform.OS === 'android' ? 50 : 10
                      }
                    ]}
                    resizeMode={Platform.OS === 'android' ? 'center' : 'contain'}
                  />
                )
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: Primary.PointColor01,
              ...BaseStyle.inputH,
              flex: 1,
              backgroundColor: Primary.PointColor01
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko15,
                marginTop: Platform.OS === 'android' ? 2 : -2,
                ...BaseStyle.font_bold,
                ...BaseStyle.textWhite
              }}
            >
              조회
            </Text>
          </TouchableOpacity>
        </View>
        <CalculateList data={data} />
      </View>
    )
  }

  const During = () => {
    // 데이트 셀렉터
    const [date, setDate] = React.useState(new Date())
    const [startDate, setStartDate] = React.useState(new Date())
    const [endDate, setEndDate] = React.useState(new Date())
    const [mode, setMode] = React.useState('date')
    const [show, setShow] = React.useState(false)
    const [dateType, setDateType] = React.useState('')

    const onChange = (event, selectedValue) => {
      const currentValue = selectedValue || date
      if (currentValue > date) {
        cusToast('오늘 이후 날짜는 지정하실 수 없습니다.')
      } else {
        if (dateType === 'end') {
          const isLower = isLowerException(currentValue, startDate, 'calculate')
          isLower(setEndDate)
        } else {
          const isHigher = isHigherException(currentValue, new Date(endDate), 'calculate')
          isHigher(setStartDate)
        }
      }
    }

    // Android 전용
    const showMode = (currentMode, payload) => {
      setDateType(payload)
      setShow(true)
      setMode(currentMode)
    }

    const showDatepicker = payload => {
      showMode('date', payload)
    }

    const showTimepicker = payload => {
      showMode('time', payload)
    }

    // iOS 전용
    const hideDatePicker = () => {
      setShow(false)
    }

    const handleConfirm = (selectedValue) => {
      hideDatePicker()
      onChange('', selectedValue)
    }

    return (
      <View style={{ flex: 1, backgroundColor: '#fff', ...BaseStyle.ph20 }}>
        <View style={{ ...BaseStyle.container5, ...BaseStyle.pv20 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => showDatepicker('start')}
            style={{
              ...BaseStyle.container,
              ...BaseStyle.border,
              ...BaseStyle.inputH,
              ...BaseStyle.mr5,
              ...BaseStyle.pl10,
              flex: 1.5,
              backgroundColor: '#fff'
            }}
          >
            <Image
              source={require('../../images/ico_calendar.png')}
              style={{ width: 18, height: 18, marginRight: Platform.OS === 'android' ? 2 : 5 }}
              resizeMode='contain'
            />
            <Text style={{ ...BaseStyle.ko14, marginTop: Platform.OS === 'android' ? 2 : -2 }}>
              {moment(startDate).format('YYYY-MM-DD')}
            </Text>
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mr5 }}>~</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => showDatepicker('end')}
            style={{
              ...BaseStyle.container,
              ...BaseStyle.border,
              ...BaseStyle.inputH,
              flex: 1.5,
              ...BaseStyle.mr5,
              backgroundColor: '#fff',
              ...BaseStyle.pl10
            }}
          >
            <Image
              source={require('../../images/ico_calendar.png')}
              style={{ width: 18, height: 18, marginRight: Platform.OS === 'android' ? 2 : 5 }}
              resizeMode='contain'
            />
            <Text style={{ ...BaseStyle.ko14, marginTop: Platform.OS === 'android' ? 2 : -2 }}>
              {moment(endDate).format('YYYY-MM-DD')}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              borderColor: Primary.PointColor01,
              ...BaseStyle.inputH,
              flex: 1,
              backgroundColor: Primary.PointColor01
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko15,
                marginTop: Platform.OS === 'android' ? 2 : -2,
                ...BaseStyle.font_bold,
                ...BaseStyle.textWhite
              }}
            >
              조회
            </Text>
          </TouchableOpacity>
        </View>
        <CalculateList data={data} />
        <DateTimePickerModal
          isVisible={show}
          mode='date'
          onConfirm={handleConfirm}
          onCancel={hideDatePicker}
          cancelTextIOS='취소'
          confirmTextIOS='적용'
          pickerStyleIOS={{ backgroundColor: 'white' }}
          customHeaderIOS={() => <View style={{ ...BaseStyle.pv15, backgroundColor: Primary.PointColor01, ...BaseStyle.container0 }}><Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>{dateType === 'start' ? '시작일자' : '종료일자'}</Text></View>}
          buttonTextColorIOS={Primary.PointColor01}
          locale='ko_KR'
        />
      </View>
    )
  }

  return (
    <Tab.Navigator
      initialRouteName='menu01'
      screenOptions={{
        tabBarActiveTintColor: '#222',
        tabBarLabelStyle: { ...BaseStyle.ko14 },
        tabBarInactiveTintColor: '#AEAEAE',
        tabBarIndicatorStyle: {
          backgroundColor: Primary.PointColor01
        },
        tabBarPressColor: 'transparent'
      }}
    >
      <Tab.Screen
        name='menu01'
        options={{
          tabBarLabel: '월별 조회'
        }}
      >
        {props => <Month {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name='menu02'
        options={{
          tabBarLabel: '기간 조회'
        }}
      >
        {props => <During {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default React.memo(CalculateTabView)
