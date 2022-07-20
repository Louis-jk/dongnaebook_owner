import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Dimensions,
  ScrollView,
  Image,
  Alert,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import 'moment/locale/ko';
import RNPickerSelect from 'react-native-picker-select';
import { useSelector, useDispatch } from 'react-redux';
import Header from '../components/SubHeader';
import BaseStyle, { Primary } from '../styles/Base';
import Api from '../Api';
import * as couponAction from '../redux/actions/couponAction';
import cusToast from '../components/CusToast';

const { width, height } = Dimensions.get('window')

const CouponAdd = props => {
  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const dispatch = useDispatch()

  const minPriceRef = React.useRef(null) // 최소 주문 금액
  const discountPriceRef = React.useRef(null) // 할인 금액

  const [type, setType] = React.useState('') // 쿠폰 구분
  const [name, setName] = React.useState('') // 쿠폰명
  const [minPrice, setMinPrice] = React.useState('') // 최소 주문 금액
  const [maxPrice, setMaxPrice] = React.useState('') // 최대 할인 금액
  const [maxDate, setMaxDate] = React.useState('') // 쿠폰 사용 기한
  const [discountPrice, setDiscountPrice] = React.useState('') // 할인 금액
  const [priceType, setPriceType] = React.useState('0') // type(정액할인: 0, 정률할인(%): 1)

  // 패키지
  const [date, setDate] = React.useState(new Date())
  const [startDate, setStartDate] = React.useState(new Date())
  const [endDate, setEndDate] = React.useState(new Date())
  const [mode, setMode] = React.useState('date')
  const [show, setShow] = React.useState(false)
  const [dateType, setDateType] = React.useState('')

  // 할인 금액 (원/%) 체인지 핸들러
  const onChangePriceAndRatioHandler = payload => {
    const discountPriceToInt = Number(discountPrice)

    if (payload === '0') {
      setPriceType(payload)
    } else if (payload === '1') {
      setPriceType(payload)

      if (discountPriceToInt > 99) {
        cusToast('할인 비율을 다시 입력해주세요.')
        setDiscountPrice('')
        couponDiscountPriceRef.current.focus()
      }
    } else {
      return false
    }
  }

  const onChange = (event, selectedValue) => {
    const currentValue = selectedValue || date
    setShow(Platform.OS === 'ios')

    if (dateType === 'start') {
      if (currentValue < date) {
        Alert.alert('오늘 이전 날짜는 지정하실 수 없습니다.', '', [
          {
            text: '확인'
          }
        ])
      } else if (currentValue > endDate) {
        Alert.alert('다운로드 유효기간 시작일이 마지막 날짜보다 클 수 없습니다.', '', [
          {
            text: '확인'
          }
        ])
      } else {
        setStartDate(currentValue)
      }
    } else {
      if (currentValue < startDate) {
        Alert.alert('다운로드 유효기간 마지막 날짜가 시작 날짜보다 작을 수 없습니다.', '', [
          {
            text: '확인'
          }
        ])
      } else {
        setEndDate(currentValue)
      }
    }
  }

  const showMode = (currentMode, payload) => {
    setDateType(payload)
    setShow(true)
    setMode(currentMode)
  };

  const showDatepicker = payload => {
    showMode('date', payload)
  };

  const getCouponListHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    }

    Api.send('store_couponzone_list', param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        dispatch(couponAction.updateCoupon(JSON.stringify(arrItems)))
      } else {
        // setReflashing(false);
      }
    })
  };

  const couponNameRef = React.useRef(null)
  const couponMinPriceRef = React.useRef(null)
  const couponMaxPriceRef = React.useRef(null)
  const couponDiscountPriceRef = React.useRef(null)
  const couponUseDayRef = React.useRef(null)

  const addCouponHandler = () => {
    const startDateFormat = moment(startDate).format('YYYY-MM-DD')
    let endDateFormat = moment(endDate).format('YYYY-MM-DD')
    let toIntDiscountPrice = parseInt(discountPrice)

    if (type === null || type === '') {
      Alert.alert('구분을 선택해주세요.', '', [
        {
          text: '확인'
        }
      ])
    } else if (name === null || name === '') {
      Alert.alert('쿠폰명을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => couponNameRef.current.focus()
        }
      ])
    } else if (minPrice === null || minPrice === '') {
      Alert.alert('최소 주문 금액을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => couponMinPriceRef.current.focus()
        }
      ])
    } else if (maxPrice === null || maxPrice === '') {
      Alert.alert('최대 할인 금액을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => couponMaxPriceRef.current.focus()
        }
      ])
    } else if (discountPrice === null || discountPrice === '') {
      if (priceType === '0') {
        Alert.alert('할인 금액을 입력해주세요.', '', [
          {
            text: '확인',
            onPress: () => couponDiscountPriceRef.current.focus()
          }
        ])
      } else {
        Alert.alert('할인 비율을 입력해주세요.', '', [
          {
            text: '확인',
            onPress: () => couponDiscountPriceRef.current.focus()
          }
        ])
      }
    } else if (toIntDiscountPrice <= 0) {
      if (priceType === '0') {
        Alert.alert('할인 금액은 0원 이상으로 설정해주세요.', '', [
          {
            text: '확인',
            onPress: () => couponDiscountPriceRef.current.focus()
          }
        ])
      } else {
        Alert.alert('할인 비율은 0% 이상 100% 이하로 설정해주세요.', '', [
          {
            text: '확인',
            onPress: () => couponDiscountPriceRef.current.focus()
          }
        ])
      }
    } else if (maxDate === null || maxDate === '') {
      Alert.alert('쿠폰 사용기간을 입력해주세요.', '', [
        {
          text: '확인',
          onPress: () => couponUseDayRef.current.focus()
        }
      ])
    } else {
      const param = {
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        cz_type: type,
        cz_subject: name,
        cz_start: startDateFormat,
        cz_end: endDateFormat,
        cz_period: maxDate,
        cz_price: discountPrice,
        cz_price_type: priceType,
        cz_minimum: minPrice,
        cz_maximum: maxPrice
      }

      Api.send('store_couponzone_input', param, args => {
        const resultItem = args.resultItem
        let arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          getCouponListHandler()
          Alert.alert('쿠폰이 등록되었습니다.', '쿠폰리스트로 이동합니다.', [
            {
              text: '확인',
              onPress: () => navigation.navigate('Home', { screen: 'Coupon' })
            },
            {
              text: '메인으로',
              onPress: () => navigation.navigate('Home', { screen: 'Main' })
            }
          ])
        } else {
          Alert.alert('쿠폰을 등록할 수 없습니다.', '다시 시도 해주세요.', [
            {
              text: '확인'
            }
          ])
        }
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='쿠폰추가' />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      <ScrollView>
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
          {/* 구분 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>구분</Text>
            <RNPickerSelect
              fixAndroidTouchableBug
              value={type}
              useNativeAndroidPickerStyle={false}
              placeholder={{ label: '선택해주세요.', value: null }}
              onValueChange={value => setType(value)}
              items={[
                { label: '모두 사용가능', value: '0' },
                { label: '포장용 쿠폰', value: '1' },
                { label: '배달용 쿠폰', value: '2' }
              ]}
              style={{
                ...customPickerStyles,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
                ...BaseStyle.inputH,
                placeholder: {
                  color: '#888'
                }
              }}
              Icon={() => {
                return (
                  <Image
                    source={require('../images/ic_select.png')}
                    style={{ width: 45, height: 45 }}
                    resizeMode='center'
                  />
                )
              }}
            />
          </View>
          {/* // 구분 */}

          {/* 쿠폰명 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              쿠폰명
            </Text>
            <View
              style={{
                ...BaseStyle.container5,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
                ...BaseStyle.inputH,
                ...BaseStyle.ph10
              }}
            >
              <TextInput
                ref={couponNameRef}
                value={name}
                placeholder='쿠폰명을 입력해주세요.'
                style={{
                  width: '95%',
                  ...BaseStyle.inputH
                }}
                onChangeText={text => setName(text)}
                autoCapitalize='none'
              />
            </View>
          </View>
          {/* // 쿠폰명 */}

          {/* 최소 주문 금액 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              최소 주문 금액
            </Text>
            <View
              style={{
                ...BaseStyle.container5,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
                ...BaseStyle.inputH,
                ...BaseStyle.ph10
              }}
            >
              <TextInput
                ref={couponMinPriceRef}
                value={minPrice}
                placeholder='0'
                style={{
                  width: '95%',
                  ...BaseStyle.inputH,
                  textAlign: 'right'
                }}
                onChangeText={text => {
                  const re = /^[0-9\b]+$/
                  if (text === '' || re.test(text)) {
                    const changed = text.replace(/(^0+)/, '')
                    setMinPrice(changed)
                  } else {
                    setMinPrice('0')
                  }
                }}
                keyboardType='number-pad'
                autoCapitalize='none'
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
            </View>
          </View>
          {/* // 최소 주문 금액 */}

          {/* 최대 할인 금액 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              최대 할인 금액
            </Text>
            <View
              style={{
                ...BaseStyle.container5,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
                ...BaseStyle.inputH,
                ...BaseStyle.ph10
              }}
            >
              <TextInput
                ref={couponMaxPriceRef}
                value={maxPrice}
                placeholder='0'
                style={{
                  width: '95%',
                  ...BaseStyle.inputH,
                  textAlign: 'right'
                }}
                onChangeText={text => {
                  const re = /^[0-9\b]+$/
                  if (text === '' || re.test(text)) {
                    const changed = text.replace(/(^0+)/, '')
                    setMaxPrice(changed)
                  } else {
                    setMaxPrice('0')
                  }
                }}
                keyboardType='number-pad'
                autoCapitalize='none'
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
            </View>
          </View>
          {/* // 최대 할인 금액 */}

          {/* 할인 금액 */}

          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              할인 {priceType === '0' ? '금액' : '비율'}
            </Text>
            <View style={{ ...BaseStyle.container }}>
              <View
                style={{
                  flex: 2,
                  ...BaseStyle.container5,
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.mr5,
                  ...BaseStyle.border
                }}
              >
                <TextInput
                  ref={couponDiscountPriceRef}
                  value={discountPrice}
                  placeholder='0'
                  style={{
                    width: '90%',
                    ...BaseStyle.inputH,
                    textAlign: 'right',
                    ...BaseStyle.pl10
                  }}
                  onChangeText={text => {
                    const re = /^[0-9\b]+$/
                    if (text === '' || re.test(text)) {
                      const changed = text.replace(/(^0+)/, '')

                      if (priceType === '1') {
                        const toIntText = Number(changed)
                        if (toIntText > 99) {
                          cusToast('할인 비율은 99%까지 입력 가능합니다.')
                          setDiscountPrice('')
                        } else if (priceType === '0') {
                          cusToast('할인 비율은 0% 이상이어야 합니다.')
                        } else {
                          setDiscountPrice(changed)
                        }
                      } else {
                        setDiscountPrice(changed)
                      }
                    } else {
                      cusToast('잘못된 입력입니다.')
                    }
                  }}
                  keyboardType='number-pad'
                  autoCapitalize='none'
                />
                <View
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    width: '10%'
                  }}
                >
                  <Text>{priceType === '1' ? '%' : '원'}</Text>
                </View>
              </View>
              <View style={{ ...BaseStyle.container, ...BaseStyle.border, ...BaseStyle.inputH }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onChangePriceAndRatioHandler('0')}
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.ph20,
                    backgroundColor: priceType === '0' ? Primary.PointColor01 : '#fff',
                    borderTopLeftRadius: 3,
                    borderBottomLeftRadius: 3
                  }}
                >
                  <Text style={{ color: priceType === '0' ? '#fff' : '#222' }}>원</Text>
                </TouchableOpacity>
                <View style={{ height: '100%', width: 1, backgroundColor: '#e5e5e5' }} />
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => onChangePriceAndRatioHandler('1')}
                  style={{
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    ...BaseStyle.ph20,
                    backgroundColor: priceType === '1' ? Primary.PointColor01 : '#fff',
                    borderTopRightRadius: 3,
                    borderBottomRightRadius: 3
                  }}
                >
                  <Text style={{ color: priceType === '1' ? '#fff' : '#222' }}>%</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {/* // 할인 금액 */}

          {/* 다운로드 유효 기간  */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              다운로드 유효 기간
            </Text>
            {/* 시작 날짜 */}
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => showDatepicker('start')}
                style={{
                  flex: 3,
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.mr5
                }}
              >
                <View style={{ ...BaseStyle.container }}>
                  <Image
                    source={require('../images/ico_calendar.png')}
                    style={{ width: 25, height: 25 }}
                    resizeMode='contain'
                  />
                  <View
                    style={{
                      ...BaseStyle.inputH,
                      textAlign: 'right',
                      justifyContent: 'center',
                      ...BaseStyle.ml10
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko15, marginTop: 3 }}>
                      {moment(startDate).format('YYYY-MM-DD')}
                    </Text>
                  </View>
                </View>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>부터</Text>
              </TouchableOpacity>
            </View>
            {/* //시작 날짜 */}
            {/* 종료 날짜 */}
            <View style={{ ...BaseStyle.container }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => showDatepicker('end')}
                style={{
                  flex: 3,
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.mr5
                }}
              >
                <View style={{ ...BaseStyle.container }}>
                  <Image
                    source={require('../images/ico_calendar.png')}
                    style={{ width: 25, height: 25 }}
                    resizeMode='contain'
                  />
                  <View
                    style={{
                      ...BaseStyle.inputH,
                      textAlign: 'right',
                      justifyContent: 'center',
                      ...BaseStyle.ml10
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko15, marginTop: 3 }}>
                      {moment(endDate).format('YYYY-MM-DD')}
                    </Text>
                  </View>
                </View>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>까지</Text>
              </TouchableOpacity>
            </View>
            {/* //종료 날짜 */}
          </View>
          {show && (
            <DateTimePicker
              testID='dateTimePicker'
              value={date}
              mode={mode}
              is24Hour
              display='default'
              onChange={onChange}
            />
          )}
          {/* // 다운로드 유효 기간  */}

          {/* 쿠폰 사용 기한 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              쿠폰 사용 기한
            </Text>
            <View
              style={{
                ...BaseStyle.container5,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
                ...BaseStyle.inputH,
                ...BaseStyle.ph10
              }}
            >
              <TextInput
                ref={couponUseDayRef}
                value={maxDate}
                placeholder='0'
                style={{
                  width: '95%',
                  ...BaseStyle.inputH,
                  textAlign: 'right'
                }}
                onChangeText={text => {
                  const re = /^[0-9\b]+$/
                  if (text === '' || re.test(text)) {
                    const changed = text.replace(/(^0+)/, '')
                    setMaxDate(changed)
                  } else {
                    setMaxDate('0')
                  }
                }}
                keyboardType='number-pad'
                autoCapitalize='none'
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>일</Text>
            </View>
          </View>
          {/* // 쿠폰 사용 기한 */}
        </View>
      </ScrollView>

      <TouchableOpacity
        activeOpacity={1}
        onPress={() => addCouponHandler()}
        style={{ ...BaseStyle.mainBtnBottom }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
          등록하기
        </Text>
      </TouchableOpacity>
    </View>
  )
};

const customPickerStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    height: 45,
    color: 'black',
    paddingRight: 30 // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 5,
    height: 45,
    color: 'black',
    paddingRight: 30 // to ensure the text is never behind the icon
  }
})

export default CouponAdd
