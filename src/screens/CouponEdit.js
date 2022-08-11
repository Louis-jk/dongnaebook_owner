import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Image,
  Platform
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import 'moment/locale/ko'
import { useSelector, useDispatch } from 'react-redux'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import * as couponAction from '../redux/actions/couponAction'
import cusToast from '../components/CusToast'
import { isHigherException, isLowerException } from '../modules/dateCheck'
import { checkCouponValidate } from '../modules/couponValidate'
import CouponCategory from '../components/Coupon/CouponCategory'
import CurrencyRateConversion from '../modules/currencyRateConversion'

const CouponEdit = props => {
  const { navigation } = props
  const { item } = props.route.params
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const dispatch = useDispatch()

  const [no, setNo] = React.useState('') // 쿠폰 No
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

  function couponInit () {
    setNo(props.route.params.item.cz_no)
    setType(props.route.params.item.cz_type)
    setName(props.route.params.item.cz_subject)
    setMinPrice(props.route.params.item.cz_minimum)
    setMaxPrice(props.route.params.item.cz_maximum)
    setDiscountPrice(props.route.params.item.cz_price)
    setPriceType(props.route.params.item.cz_price_type)
    setStartDate(new Date(props.route.params.item.cz_start))
    setEndDate(props.route.params.item.cz_end)
    setMaxDate(props.route.params.item.cz_period)
  }

  React.useEffect(() => {
    couponInit()
    return () => couponInit()
  }, [])

  // 할인 금액 (원/%) 체인지 핸들러
  const onChangePriceAndRatioHandler = payload => {
    const conversion = CurrencyRateConversion(payload, discountPrice)
    conversion(setPriceType, setDiscountPrice, couponDiscountPriceRef)
  }

  const onChange = (event, selectedValue) => {
    const currentValue = selectedValue || date
    setShow(Platform.OS === 'ios')

    if (dateType === 'start') {
      const isHigher = isHigherException(currentValue, endDate)
      isHigher(setStartDate)
    } else {
      const isLower = isLowerException(currentValue, startDate)
      isLower(setEndDate)
    }
  }

  const showMode = (currentMode, payload) => {
    setDateType(payload)
    setShow(true)
    setMode(currentMode)
  }

  const showDatepicker = payload => {
    showMode('date', payload)
  }

  const getCouponListHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mtId,
      jumju_code: mtJumjuCode
    }

    Api.send('store_couponzone_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        dispatch(couponAction.updateCoupon(JSON.stringify(arrItems)))
      } else {
        dispatch(couponAction.updateCoupon(null))
      }
    })
  }

  const couponNameRef = React.useRef(null)
  const couponMinPriceRef = React.useRef(null)
  const couponMaxPriceRef = React.useRef(null)
  const couponDiscountPriceRef = React.useRef(null)
  const couponUseDayRef = React.useRef(null)

  const addCouponHandler = () => {
    const startDateFormat = moment(startDate).format('YYYY-MM-DD')
    const endDateFormat = moment(endDate).format('YYYY-MM-DD')
    const toIntDiscountPrice = parseInt(discountPrice)

    // 쿠폰 유효성 체크
    const isValidate = checkCouponValidate(type, name, minPrice, priceType, maxPrice, discountPrice, toIntDiscountPrice, maxDate, couponNameRef, couponMinPriceRef, couponMaxPriceRef, couponDiscountPriceRef, couponUseDayRef)

    if (isValidate) {
      const param = {
        cz_no: no,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        cz_type: type,
        cz_subject: name,
        cz_start: startDateFormat,
        cz_end: endDateFormat,
        cz_period: maxDate,
        cz_price: discountPrice,
        cz_price_type: priceType,
        cz_minimum: minPrice,
        cz_maximum: priceType === '1' ? maxPrice : 0
      }

      Api.send('store_couponzone_update', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          getCouponListHandler()
          cusToast('쿠폰이 수정되었습니다.\n쿠폰리스트로 이동합니다.')
        } else {
          cusToast('쿠폰을 수정하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 2500)
        }

        setTimeout(() => {
          navigation.navigate('Home', { screen: 'Coupon' })
        }, 1000)
      })
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='쿠폰수정' />

      <ScrollView>
        <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
          {/* 구분 */}
          <View style={{ ...BaseStyle.mv10 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              구분
            </Text>
            <CouponCategory type={type} setType={setType} />
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
          {priceType === '1' && (
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
          )}
          {/* // 최대 할인 금액 */}

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
                  const filteredText = text.replace(/(-)|(\.)/gi, '')

                  if (filteredText !== null || filteredText !== '') {
                    setMaxDate(filteredText)
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
          수정하기
        </Text>
      </TouchableOpacity>
    </View>
  )
}

export default CouponEdit
