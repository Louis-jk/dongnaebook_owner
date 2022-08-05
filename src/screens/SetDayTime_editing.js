import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import { Calendar, CalendarList, Agenda, LocaleConfig } from 'react-native-calendars'
import { useSelector, useDispatch } from 'react-redux'
import Api from '../Api'
import StoreTime from '../components/StoreTime'
import StoreRegularHoliday from '../components/StoreRegularHoliday'
import * as closedDayAction from '../redux/actions/closedDayAction'
import * as storeTimeAction from '../redux/actions/storeTimeAction'

export function ListCheckbox (props) {
  return <View />
}

const SetDayTime = props => {
  const [listCheckbox, setListCheckbox] = React.useState()

  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const { storeTime } = useSelector(state => state.storeTime)

  const dispatch = useDispatch()

  const [isLoading, setLoading] = React.useState(false)
  const [storeTimeList, setStoreTimeList] = React.useState(null) // 영업시간

  // 영업시간
  const getStoreTimeHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'list'
    }
    Api.send('store_service_hour', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        setStoreTimeList(arrItems)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      } else {
        setStoreTimeList(null)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)))
      }
    })
  }

  const delStoreTimeHandler = st_idx => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      st_idx,
      mode: 'delete'
    }
    Api.send('store_service_hour', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getStoreTimeHandler()
      } else {
        Alert.alert('영업시간을 삭제할 수 없습니다.', '다시 한번 확인해주세요.', [
          {
            text: '확인'
          }
        ])
      }
    })
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStoreTimeHandler()
    })
    return unsubscribe
  }, [navigation])

  const storeTimeRender = ({ item, index }) => {
    return (
      <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv7 }}>
        <View style={{ ...BaseStyle.container5, ...BaseStyle.mv10 }}>
          <View style={{ ...BaseStyle.container }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
              {item.st_yoil_txt}
            </Text>
            <Text style={{ ...BaseStyle.ko14 }}>{`${item.st_stime} ~ ${item.st_etime}`}</Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() =>
              Alert.alert('해당 영업시간을 삭제하시겠습니까?', '삭제하시면 복구하실 수 없습니다.', [
                {
                  text: '예',
                  onPress: () => delStoreTimeHandler(item.st_idx)
                },
                {
                  text: '아니오'
                }
              ])}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <Image
              source={require('../images/popup_close.png')}
              style={{ width: 18, height: 18, borderRadius: 18, opacity: 0.5 }}
              resizeMode='cover'
            />
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const { markedDay } = useSelector(state => state.closedDay)

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
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
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
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      sh_date: payload,
      mode: 'update'
    }
    Api.send('store_hoilday', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        // getHolidayAllListHandler();
        console.log('====================================')
        console.log('resultItem 캘린더 ::: ', resultItem)
        console.log('arrItems 캘린더 ::: ', arrItems)
        console.log('====================================')
      } else {
        console.log('선택 날짜 ? ', arrItems)
        // Alert.alert('데이터를 받아오는데 오류가 발생하였습니다.','관리자에게 문의해주세요.', [
        //   {
        //     text: '확인'
        //   }
        // ]);
      }
    })
  }

  React.useEffect(() => {
    getHolidayAllListHandler()

    return () => getHolidayAllListHandler()
  }, [])

  const _renderArrow = direction => {
    return (
      <Image
        source={
          direction === 'left'
            ? require('../images/pg_prev02.png')
            : require('../images/pg_next02.png')
        }
        style={{ width: 20, height: 20 }}
        resizeMode='contain'
      />
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='영업 운영 시간 설정' type='save' />
      {/* <StatusMenu navigation={navigation} /> */}

      <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>영업시간</Text>
      </View>
      <FlatList
        data={storeTime}
        renderItem={storeTimeRender}
        keyExtractor={(list, index) => index.toString()}
        // pagingEnabled={true}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        // progressViewOffset={true}
        refreshing
        style={{ backgroundColor: '#fff', width: '100%' }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              ...BaseStyle.mv15
            }}
          >
            <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
              아직 등록된 영업시간이 없습니다.
            </Text>
          </View>
        }
        ListFooterComponent={
          <>
            <StoreRegularHoliday navigation={navigation} />
            <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>휴무일</Text>
            </View>
            <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv15 }}>
              <View style={{ ...BaseStyle.mv10 }}>
                <Calendar
                  // markingType={'custom'}
                  markedDates={marking}
                  horizontal
                  pagingEnabled
                  current={new Date()}
                  onDayPress={day => setMarkedDays(day.dateString)}
                  onDayLongPress={day => setMarkedDays(day.dateString)}
                  monthFormat="yyyy년 M월"
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
                    selectedDayTextColor: '#00509d',
                    todayTextColor: '#43aa8b',
                    dayTextColor: '#222',
                    textDisabledColor: '#d9e1e8',
                    dotColor: Primary.PointColor01,
                    selectedDotColor: Primary.PointColor01,
                    arrowColor: 'orange',
                    disabledArrowColor: '#d9e1e8',
                    monthTextColor: '#333',
                    indicatorColor: 'blue',
                    textDayFontFamily: 'monospace',
                    textMonthFontFamily: 'monospace',
                    textDayHeaderFontFamily: 'monospace',
                    textDayFontWeight: '300',
                    textMonthFontWeight: 'bold',
                    textDayHeaderFontWeight: '300',
                    textDayFontSize: 16,
                    textMonthFontSize: 20,
                    textDayHeaderFontSize: 16
                  }}
                />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => navigation.navigate('Home', { screen: 'SetTime' })}
                  style={{ ...BaseStyle.mainBtn, ...BaseStyle.mv10 }}
                >
                  <Text
                    style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222 }}
                  >
                    영업시간 추가
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        }
      />
    </View>
  )
}

export default SetDayTime
