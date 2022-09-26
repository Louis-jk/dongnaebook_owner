import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
  Platform
} from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import AnimateLoading from '../../components/Loading/AnimateLoading'
import cusToast from '../../components/CusToast'
import { TextInput } from 'react-native-gesture-handler'

const StoreSetting = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const [storeInit, setStoreInit] = React.useState(false) // 매장 정보 초기값 유무
  const [range, setRange] = React.useState('curr')
  const [isLoading, setLoading] = React.useState(true)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  // 매장소개 정보
  const [setting, setSetting] = React.useState({
    do_coupon_use: '', // 쿠폰 사용 가능 여부 'Y' | 'N'
    do_take_out: '', // 포장 가능 여부 'Y' | 'N'
    mt_print: '', // 자동출력 '1', 출력안함 '0'
    mt_sound: '', // 사운드 울림 횟수,
    do_delivery: '', // 배달 가능 
    do_for_here: '', // 먹고가기(매장 식사) 가능
    do_min_price: '0', // 배달 최소주문금액
    do_min_price_wrap: '0', // 포장 최소주문금액
    do_min_price_for_here: '0', // 매장식사 최소주문금액
  })

  const param = {
    encodeJson: true,
    jumju_id: mtId,
    jumju_code: mtJumjuCode
  }

  const getStoreInfo = () => {
    Api.send('store_guide', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        setStoreInit(true)
        setSetting({
          do_coupon_use: arrItems.do_coupon_use,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print,
          do_take_out: arrItems.do_take_out,
          do_delivery: arrItems.do_delivery,
          do_for_here: arrItems.do_for_here,
          do_min_price: arrItems.do_min_price,
          do_min_price_wrap: arrItems.do_min_price_wrap,
          do_min_price_for_here: arrItems.do_min_price_for_here,
          do_take_out_discount: arrItems.do_take_out_discount,
          do_for_here_discount: arrItems.do_for_here_discount,
          do_for_here_minimum: arrItems.do_for_here_minimum
        })
      } else {
        setStoreInit(false)
        setSetting({
          do_coupon_use: null,
          mt_sound: null,
          mt_print: null,
          do_take_out: null,
          do_delivery: null,
          do_for_here: null,
          do_min_price: null,
          do_min_price_wrap: null,
          do_min_price_for_here: null,
          do_take_out_discount: null,
          do_for_here_discount: null,
          do_for_here_minimum: null
        })
      }

      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getStoreInfo()
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const onSubmitStoreInfo = () => {
    const data = {
      mode: 'insert',
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      do_coupon_use: setting.do_coupon_use,
      mt_sound: setting.mt_sound,
      do_take_out: setting.do_take_out,
      do_delivery: setting.do_delivery,
      do_for_here: setting.do_for_here,
      do_min_price: setting.do_min_price,
      do_min_price_wrap: setting.do_min_price_wrap,
      do_min_price_for_here: setting.do_min_price_for_here,
      mb_one_saving: setting.mb_one_saving
    }

    Api.send('store_guide_update', data, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        cusToast('매장정보를 등록하였습니다.\n메인화면으로 이동합니다.', 1500)
        setTimeout(() => {
          navigation.navigate('Home', { screen: 'Main' })
        }, 1500)
      }
    })
  }

  const introduceRef = React.useRef(null)
  const majorMenuRef = React.useRef(null)

  const onModifyStoreSetting = () => {
    if (setting.do_take_out === null || setting.do_take_out === '') {
      cusToast('포장 가능 여부를 지정해주세요.')
    } else if (setting.do_delivery === null || setting.do_delivery === '') {
      cusToast('배달 가능 여부를 지정해주세요.')
    } else if (setting.do_for_here === null || setting.do_for_here === '') {
      cusToast('먹고가기 가능 여부를 지정해주세요.')
    } else if (setting.do_coupon_use === null || setting.do_coupon_use === '') {
      cusToast('쿠폰 사용 가능 여부를 지정해주세요.')
    } else if (setting.mt_sound === null || setting.mt_sound === '') {
      cusToast('알림음을 설정해주세요.')
    } else {
      const param = {
        mode: 'update',
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        do_coupon_use: setting.do_coupon_use,
        mt_sound: setting.mt_sound,
        mt_print: setting.mt_print,
        do_take_out: setting.do_take_out,
        do_delivery: setting.do_delivery,
        do_for_here: setting.do_for_here,
        do_min_price: setting.do_delivery === 'Y' ? setting.do_min_price : '0',
        do_min_price_wrap: setting.do_take_out === 'Y' ? setting.do_min_price_wrap : '0',
        do_take_out_discount: setting.do_take_out === 'Y' ? setting.do_take_out_discount : '0',
        do_min_price_for_here: setting.do_for_here === 'Y' ? setting.do_min_price_for_here : '0',
        do_for_here_discount: setting.do_for_here === 'Y' ? setting.do_for_here_discount : '0',
        do_for_here_minimum: setting.do_for_here === 'Y' ? setting.do_for_here_minimum : '0',
        RangeType: range
      }
  

      Api.send('store_setting_update', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems
        if (resultItem.result === 'Y') {
          cusToast('매장설정을 수정하였습니다.')
        } else {
          cusToast('매장설정을 수정하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.')
        }
      })
    }
  }

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='매장설정' />

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View>
              <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
                <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb10 }}>
                  ※ 표시는 필수 입력란 입니다.
                </Text>

                {/* 알림음 설정 */}
                <View style={{ ...BaseStyle.mv10 }}>

                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5
                      }}
                    >
                      알림음 설정
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, mt_sound: '1' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.mt_sound === '1'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>1회 울림</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, mt_sound: '2' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.mt_sound === '2'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>2회 울림</Text>
                    </TouchableOpacity>
                
                  </View>
                </View>
                {/* // 알림음 설정 */}

                {/* 프린터 자동출력 여부 */}
                {/* <View style={{...BaseStyle.mv10}}>
              <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>
                  주문 접수시 자동 프린트 출력 여부
                </Text>
                <Text style={{...BaseStyle.ko12, color: Primary.PointColor02}}>※</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mv10}}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, mt_print: "1"})}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr20}}>
                  <Image
                    source={
                      setting.mt_print === "1"
                        ? require("../images/ic_check_on.png")
                        : require("../images/ic_check_off.png")
                    }
                    style={{width: 20, height: 20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>자동 출력</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, mt_print: "0"})}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr10}}>
                  <Image
                    source={
                      setting.mt_print === "0"
                        ? require("../images/ic_check_on.png")
                        : require("../images/ic_check_off.png")
                    }
                    style={{width: 20, height: 20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>자동 출력 안함</Text>
                </TouchableOpacity>
              </View>
            </View> */}
                {/* // 프린터 자동출력 여부 */}

                {/* 배달 가능 여부 */}
                  <View style={setting.do_delivery === 'Y' ? { ...BaseStyle.mt10 } : {...BaseStyle.mv10}}>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      배달 가능 여부
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_delivery: 'Y' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.do_delivery === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>배달 가능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_delivery: 'N' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                    >
                      <Image
                        source={
                      setting.do_delivery === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>배달 불가능</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 배달 가능 여부 */}
                
                {setting.do_delivery === 'Y' && (
                  <View style={{ ...BaseStyle.mt10, ...BaseStyle.mb20 }}>
                    {/* 배달 최소주문금액 */}
                    <View>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          배달 최소 주문 금액
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_min_price}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_min_price: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_min_price: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                      </View>
                    </View>
                    {/* // 배달 최소주문금액 */}
                  </View>
                )}

                {/* 포장 가능 여부 */}
                <View style={setting.do_take_out === 'Y' ? { ...BaseStyle.mt10 } : {...BaseStyle.mv10}}>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      주문 포장 가능 여부
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_take_out: 'Y' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.do_take_out === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>포장 가능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_take_out: 'N' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                    >
                      <Image
                        source={
                      setting.do_take_out === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>포장 불가능</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 포장 가능 여부 */}

                {setting.do_take_out === 'Y' && (
                  <View style={{ ...BaseStyle.mt10, ...BaseStyle.mb20 }}>
                    {/* 포장 최소주문금액 */}
                    <View style={{ ...BaseStyle.mb15 }}>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          포장 최소 주문 금액
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_min_price_wrap}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_min_price_wrap: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_min_price_wrap: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                      </View>
                    </View>
                    {/* // 포장 최소주문금액 */}

                    {/* 포장 할인 */}
                    <View>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          포장 할인
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_take_out_discount}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_take_out_discount: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_take_out_discount: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                      </View>
                    </View>
                    {/* // 포장 할인 */}
                  </View>
                )}

                {/* 먹고가기 가능 여부 */}
                <View style={setting.do_for_here === 'Y' ? { ...BaseStyle.mt10 } : {...BaseStyle.mv10}}>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      먹고가기 가능 여부
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_for_here: 'Y' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.do_for_here === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>먹고가기 가능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_for_here: 'N' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                    >
                      <Image
                        source={
                      setting.do_for_here === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>먹고가기 불가능</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 먹고가기 가능 여부 */}

                {setting.do_for_here === 'Y' && (
                  <View style={{ ...BaseStyle.mb20 }}>
                    {/* 먹고가기(매장 식사) 최소주문금액 */}
                    <View style={{ ...BaseStyle.mv10 }}>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          먹고가기(매장 식사) 최소 주문 금액
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_min_price_for_here}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_min_price_for_here: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_min_price_for_here: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                      </View>
                    </View>
                    {/* // 먹고가기(매장 식사) 최소주문금액 */}

                    {/* 먹고가기 할인 */}
                    <View style={{ ...BaseStyle.mv10 }}>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          먹고가기 할인
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_for_here_discount}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_for_here_discount: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_for_here_discount: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                      </View>
                    </View>
                    {/* // 먹고가기 할인 */}

                    {/* 먹고가기 최소인원 */}
                    <View style={{ ...BaseStyle.mv10 }}>
                      <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_bold,
                            ...BaseStyle.mr5
                          }}
                        >
                          먹고가기 최소인원
                        </Text>
                        <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                      </View>
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
                          value={setting.do_for_here_minimum}
                          placeholder='0'
                          style={{
                            width: '95%',
                            ...BaseStyle.inputH,
                            textAlign: 'right',
                            ...BaseStyle.ko15,
                            marginTop: Platform.OS === 'android' ? 10 : 0
                          }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setSetting({
                                ...setting,
                                do_for_here_minimum: changed
                              })
                            } else {
                              setSetting({
                                ...setting,
                                do_for_here_minimum: '0'
                              })
                            }
                          }}
                          keyboardType='number-pad'
                          autoCapitalize='none'
                        />
                        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>명</Text>
                      </View>
                    </View>
                    {/* // 먹고가기 최소인원 */}
                  </View>
                )}

                {/* 쿠폰 사용 가능 여부 삭제요청(쿠폰등록 페이지로 이동 요청) */}
                
                <View style={setting.do_for_here === 'Y' ? { ...BaseStyle.mb10 } : {...BaseStyle.mv10}}>
                  {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              쿠폰 사용 가능 여부
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5
                      }}
                    >
                      쿠폰 사용 가능 여부
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_coupon_use: 'Y' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      setting.do_coupon_use === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>사용 가능</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setSetting({ ...setting, do_coupon_use: 'N' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                    >
                      <Image
                        source={
                      setting.do_coupon_use === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>사용 불가능</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 쿠폰 사용 가능 여부 */}

                {/* 주문마감 여부 삭제요청(휴무일 영업일 안내 페이지로 이동 요청) */}
                {/* <View style={{...BaseStyle.mv10}}>
              <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_bold,
                    ...BaseStyle.mr5,
                  }}>
                  주문마감 여부
                </Text>
                <Text style={{...BaseStyle.ko12, color: Primary.PointColor02}}>※</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mv10}}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, do_end_state: 'Y'})}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr20}}>
                  <Image
                    source={
                      info.do_end_state === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                    style={{width: 20, height: 20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>주문 가능</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, do_end_state: 'N'})}
                  hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr10}}>
                  <Image
                    source={
                      info.do_end_state === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                    style={{width: 20, height: 20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>주문 마감</Text>
                </TouchableOpacity>
              </View>
            </View> */}
                {/* // 주문마감 여부 */}

                {/* 1인분 가능 여부 */}
                {/* <View style={{...BaseStyle.mv10}}>
              <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>1인분 가능 여부</Text>
                <Text style={{...BaseStyle.ko12, color:Primary.PointColor02}}>※</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mv10}}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, mb_one_saving: '1'})}
                  hitSlop={{top:10, right:10, bottom:10, left:10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr20}}
                >
                  <Image
                    source={info.mb_one_saving === '1' ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')}
                    style={{width:20, height:20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>1인분 가능</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({...setting, mb_one_saving: '0'})}
                  hitSlop={{top:10, right:10, bottom:10, left:10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr10}}
                >
                  <Image
                    source={info.mb_one_saving === '0' ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')}
                    style={{width:20, height:20, ...BaseStyle.mr5}}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>1인분 불가능</Text>
                </TouchableOpacity>
              </View>
            </View> */}
                {/* // 1인분 가능 여부 */}
              </View>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.ph20, marginBottom: 40 }}>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setRange('all')}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: range === 'all' ? Primary.PointColor01 : '#ececec',
                  paddingVertical: 20,
                  borderTopLeftRadius: 5,
                  borderBottomLeftRadius: 5
                }}
              >
                <Text style={{ ...BaseStyle.ko15, color: range === 'all' ? '#fff' : '#aaa' }}>
                  전체 매장 적용
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => setRange('curr')}
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: range === 'curr' ? Primary.PointColor01 : '#ececec',
                  paddingVertical: 20,
                  borderTopRightRadius: 5,
                  borderBottomRightRadius: 5
                }}
              >
                <Text style={{ ...BaseStyle.ko15, color: range === 'curr' ? '#fff' : '#aaa' }}>
                  해당 매장만 적용
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
          {storeInit && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onModifyStoreSetting}
              style={{ ...BaseStyle.mainBtnBottom }}
            >
              <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
                수정하기
              </Text>
            </TouchableOpacity>
          )}

          {!storeInit && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onSubmitStoreInfo}
              style={{ ...BaseStyle.mainBtnBottom }}
            >
              <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>등록하기</Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.goBack()}
        style={{...BaseStyle.mainBtnBottom, backgroundColor:'#e5e5e5'}}
      >
        <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold}}>나가기</Text>
      </TouchableOpacity> */}
        </View>}
    </>
  )
}

export default StoreSetting
