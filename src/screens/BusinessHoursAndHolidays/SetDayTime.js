import * as React from 'react'
import {
  View,
  Text,
  Image,
  ScrollView,
  BackHandler
} from 'react-native'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import { Calendar, LocaleConfig } from 'react-native-calendars'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import Api from '../../Api'
import StoreTime from '../../components/BusinessHoursAndHolidays/StoreTime'
import StoreRegularHoliday from '../../components/BusinessHoursAndHolidays/StoreRegularHoliday'

export function ListCheckbox (props) {
  return <View />
}

const SetDayTime = props => {
  const [listCheckbox, setListCheckbox] = React.useState()

  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const { markedDay } = useSelector(state => state.closedDay)
  const [newDate, setNewDate] = React.useState('');

  React.useEffect(() => {
    let currDate = moment(new Date()).format('YYYY-MM-DD') 
    setNewDate(currDate)
  }, [])

  console.log('newDate?', newDate);

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  // 휴무일 마킹
  const [marking, setMarking] = React.useState({})

  const markDate = day => {
    const markDates = {}
    markDates[day] = { selected: true, selectedColor: Primary.PointColor01, marked: true }
    setMarking(markDates)
  }

  LocaleConfig.locales.kr = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월'
    ],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토']
  }
  LocaleConfig.defaultLocale = 'kr'

  const getHolidayAllListHandler = () => {
    // setCaIsLoading(false);
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'list'
    }

    Api.send('store_hoilday', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        const markDates = {}
        arrItems.map(date => {
          markDates[date.sh_date] = {
            selected: true,
            selectedColor: Primary.PointColor01,
            marked: true
          }
          const newObj = Object.assign(marking, markDates)
          setMarking(newObj)

          const rs2 = <ListCheckbox checked items={1} /> // 리렌더링 (캘린더 멀티마킹 실시간 반영 안됨으로 강제 리렌더링)
          setListCheckbox(rs2)
          // dispatch(closedDayAction.updateClosedDay(JSON.stringify(newObj)));
        })
      } else {
        const markDates = {}
        arrItems.map(date => {
          markDates[date.sh_date] = {
            selected: true,
            selectedColor: Primary.PointColor01,
            marked: true
          }
          const newObj = Object.assign(marking, markDates)
          setMarking(newObj)

          const rs2 = <ListCheckbox checked items={1} /> // 리렌더링 (캘린더 멀티마킹 실시간 반영 안됨으로 강제 리렌더링)
          setListCheckbox(rs2)
          // dispatch(closedDayAction.updateClosedDay(JSON.stringify(newObj)));
        })
      }
    })
  }

  const setMarkedDays = payload => {
    selectHolidayHandler(payload)

    const markDates = {}
    markDates[payload] = { selected: true, selectedColor: Primary.PointColor01, marked: true }

    const check = marking.hasOwnProperty(payload) // 마킹 포함 여부(Object)

    if (check) {
      // 마킹 안 포함일 경우
      delete marking[payload] // 해당 마킹 Obj 삭제
    } else {
      const newObj = Object.assign(marking, markDates)
      setMarking(newObj)
    }
    const rs2 = <ListCheckbox checked items={1} /> // 리렌더링 (캘린더 멀티마킹 실시간 반영 안됨으로 강제 리렌더링)
    setListCheckbox(rs2)
  }

  const selectHolidayHandler = payload => {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      sh_date: payload,
      mode: 'update'
    }
    Api.send('store_hoilday', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        // getHolidayAllListHandler();
        // console.log('====================================')
        // console.log('resultItem 캘린더 ::: ', resultItem)
        // console.log('arrItems 캘린더 ::: ', arrItems)
        // console.log('====================================')
      } else {
        console.log('선택 날짜 ? ', arrItems)
      }
    })
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getHolidayAllListHandler()
    }
    return () => {
      isSubscribed = false
    }
  }, [])

  const _renderArrow = direction => {
    return (
      <Image
        source={
          direction === 'left'
            ? require('../../images/pg_prev02.png')
            : require('../../images/pg_next02.png')
        }
        style={{ width: 20, height: 20 }}
        resizeMode='contain'
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='영업 운영 시간 설정' type='save' />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* 영업시간 */}
        <StoreTime navigation={navigation} />
        {/* // 영업시간 */}

        {/* 정기휴일 */}
        <StoreRegularHoliday navigation={navigation} />
        {/* // 정기휴일 */}

        {/* 휴무일 */}
        <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>휴무일</Text>
        </View>
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv15 }}>
          {/* 캘린더 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Calendar
              // markingType={'custom'}
              markedDates={marking}
              horizontal
              pagingEnabled
              current={newDate}
              onDayPress={day => setMarkedDays(day.dateString)}
              onDayLongPress={day => setMarkedDays(day.dateString)}
              monthFormat='yyyy년 M월'
              onMonthChange={month => {
                console.log('month changed', month)
              }}
              hideArrows={false}
              renderArrow={_renderArrow}
              hideExtraDays={false}
              disableMonthChange
              firstDay={7}
              hideDayNames={false}
              showWeekNumbers={false}
              onPressArrowLeft={subtractMonth => subtractMonth()}
              onPressArrowRight={addMonth => addMonth()}
              disableArrowLeft={false}
              disableArrowRight={false}
              // Disable all touch events for disabled days. can be override with disableTouchEvent in markedDates
              disableAllTouchEventsForDisabledDays
              enableSwipeMonths
              style={{
                height: 350
              }}
              theme={{
                'stylesheet.calendar.header': {
                  dayTextAtIndex0: {
                    color: '#d62828'
                  },
                  dayTextAtIndex6: {
                    color: '#00509d'
                  }
                },
                backgroundColor: '#ffffff',
                calendarBackground: '#ffffff',
                textSectionTitleColor: Primary.PointColor02,
                textSectionTitleDisabledColor: '#d9e1e8',
                selectedDayBackgroundColor: Primary.PointColor01,
                selectedDayTextColor: '#fff',
                todayTextColor: '#20ABC8',
                dayTextColor: '#222',
                textDisabledColor: '#d9e1e8',
                dotColor: Primary.PointColor01,
                selectedDotColor: Primary.PointColor01,
                arrowColor: 'orange',
                disabledArrowColor: '#d9e1e8',
                monthTextColor: '#333',
                indicatorColor: 'blue',
                // textDayFontFamily: 'monospace',
                // textMonthFontFamily: 'monospace',
                // textDayHeaderFontFamily: 'monospace',
                textDayFontWeight: '300',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '300',
                textDayFontSize: 16,
                textMonthFontSize: 20,
                textDayHeaderFontSize: 16
              }}
            />
          </View>
          {/* //캘린더 */}
        </View>
        {/* //휴무일 */}
      </ScrollView>
    </View>
  )
}

export default SetDayTime
