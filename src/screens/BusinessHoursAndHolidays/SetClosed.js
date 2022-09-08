import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions
} from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import * as regHolidayAction from '../../redux/actions/regularHolidayAction'
import cusToast from '../../components/CusToast'
import { weekData, weekArr } from '../../data/week'
import Divider from '../../components/Divider'

const SetClosed = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const dispatch = useDispatch()

  // 요일
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

  // 주
  const [selectWeek, setSelectWeek] = React.useState([])
  const selectWeekHandler = payload => {
    const filtered = selectWeek.find(week => week === payload)

    if (!filtered) {
      setSelectWeek([...new Set([...selectWeek, payload])])
    } else {
      const removeObj = selectWeek.filter(week => week !== payload)
      setSelectWeek(removeObj)
    }
  }

  const getStoreRegularHoliday = () => {
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
      }
    })
  }

  const setStoreRHolidayHandler = () => {
    const selectDayFormat = selectDay.join()
    const selectWeekFormat = selectWeek.join()

    if (selectDay === null || selectDay === '' || selectDay.length === 0) {
      cusToast('요일을 선택해주세요.')
    } else if (selectWeek === null || selectWeek === '' || selectWeek.length === 0) {
      cusToast('주를 선택해주세요.')
    } else {
      const param = {
        encodeJson: true,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        mode: 'update',
        st_yoil: selectDayFormat,
        st_week: selectWeekFormat
      }
      Api.send('store_regular_hoilday', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          cusToast('정기휴일을 추가하였습니다.')
        } else {
          cusToast('정기휴일을 추가하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 2500)
        }
        setTimeout(() => {
          navigation.navigate('Home', { screen: 'SetDayTime' })
        }, 1500)
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='정기휴일 설정' type='save' />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        <Divider backgroundColor='#E3E3E3' />
        <View style={{ ...BaseStyle.mb20 }} />

        {/* 요일 선택 */}
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv10, ...BaseStyle.container5 }}>
          {weekData.map((day, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={() => selectDayHandler(day.idx)}
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                width: Dimensions.get('window').width / 9.8,
                height: Dimensions.get('window').width / 9.8,
                borderRadius: Dimensions.get('window').width / 9.8,
                backgroundColor: selectDay.includes(day.idx) ? Primary.PointColor01 : '#fff',
                borderWidth: 1,
                borderColor: selectDay.includes(day.idx) ? Primary.PointColor01 : '#E3E3E3',
                marginLeft: index !== 0 ? 10 : 0
              }}
            >
              <Text
                style={{
                  color: selectDay.includes(day.idx) ? '#fff' : '#222'
                }}
              >
                {day.ko}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* //요일 선택 */}

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
            {weekArr.map((week, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={1}
                onPress={() => selectWeekHandler(week.key)}
                style={{
                  ...BaseStyle.container,
                  marginBottom: 15
                }}
              >
                <Image
                  source={
                    selectWeek.includes(week.key)
                      ? require('../../images/ic_check_on.png')
                      : require('../../images/ic_check_off.png')
                  }
                  style={{ width: 25, height: 25, ...BaseStyle.mr10 }}
                  resizeMode='contain'
                  fadeDuration={100}
                />
                <Text style={{ ...BaseStyle.ko16 }}>{week.value}</Text>
              </TouchableOpacity>
            ))}
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
                allTime ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')
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
        onPress={setStoreRHolidayHandler}
        style={{ ...BaseStyle.mainBtnBottom }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
          저장하기
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default SetClosed
