import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
  ScrollView,
  BackHandler
} from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'

const StoreSetting = props => {
  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const [storeInit, setStoreInit] = React.useState(false) // 매장 정보 초기값 유무
  const [range, setRange] = React.useState('curr')

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  // 매장소개 정보
  const [setting, setSetting] = React.useState({
    do_coupon_use: '', // 쿠폰 사용 가능 여부 'Y' | 'N'
    do_take_out: '', // 포장 가능 여부 'Y' | 'N'
    mt_print: '', // 자동출력 '1', 출력안함 '0'
    mt_sound: '' // 사운드 울림 횟수
  })

  const param = {
    encodeJson: true,
    jumju_id: mt_id,
    jumju_code: mt_jumju_code
  }

  const getStoreInfo = () => {
    Api.send('store_guide', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        setStoreInit(true)
        setSetting({
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          mt_sound: arrItems.mt_sound,
          mt_print: arrItems.mt_print
        })
      } else {
        setStoreInit(false)
        setSetting({
          do_take_out: null,
          do_coupon_use: null,
          mt_sound: null,
          mt_print: null
        })
      }
    })
  }

  React.useEffect(() => {
    getStoreInfo()

    return () => getStoreInfo()
  }, [])

  const onSubmitStoreInfo = () => {
    const data = {
      mode: 'insert',
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      do_take_out: setting.do_take_out,
      do_coupon_use: setting.do_coupon_use,
      mt_sound: setting.mt_sound,
      mb_one_saving: setting.mb_one_saving
    }

    Api.send('store_guide_update', data, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        Alert.alert('매장정보를 등록하였습니다.', '메인화면으로 이동합니다.', [
          {
            text: '예',
            onPress: () => navigation.navigate('Home', { screen: 'Main' })
          }
        ])
      }
    })
  }

  const introduceRef = React.useRef(null)
  const majorMenuRef = React.useRef(null)

  const onModifyStoreSetting = () => {
    if (setting.do_take_out === null || setting.do_take_out === '') {
      Alert.alert('포장 가능 여부를 지정해주세요.', '', [
        {
          text: '확인'
        }
      ])
    } else if (setting.do_coupon_use === null || setting.do_coupon_use === '') {
      Alert.alert('쿠폰 사용 가능 여부를 지정해주세요.', '', [
        {
          text: '확인'
        }
      ])
    } else if (setting.mt_sound === null || setting.mt_sound === '') {
      Alert.alert('알림음을 설정해주세요.', '', [
        {
          text: '확인'
        }
      ])
    } else {
      const param = {
        mode: 'update',
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        do_take_out: setting.do_take_out,
        do_coupon_use: setting.do_coupon_use,
        mt_sound: setting.mt_sound,
        mt_print: setting.mt_print,
        RangeType: range
      }

      // else if (setting.mt_print === null || setting.mt_print === "") {
      //   Alert.alert("주문 접수시 자동 프린트 여부를 지정해주세요.", "", [
      //     {
      //       text: "확인",
      //     },
      //   ]);
      // }

      console.log('param', param)

      Api.send('store_setting_update', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems
        if (resultItem.result === 'Y') {
          Alert.alert('매장설정을 수정하였습니다.', '메인화면으로 이동하시겠습니까?', [
            {
              text: '예',
              onPress: () => navigation.navigate('Home', { screen: 'Main' })
            },
            {
              text: '아니요'
            }
          ])
        } else {
          Alert.alert(
            '매장설정을 수정하는 중에 오류가 발생했습니다.',
            '계속 오류가 발생할 경우 관리자에게 문의 해주세요.',
            [
              {
                text: '확인'
              }
            ]
          )
        }
      })
    }
  }

  console.log('setting', setting)
  console.log('range', range)

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='매장설정' />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
            <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb10 }}>
              ※ 표시는 필수 입력란 입니다.
            </Text>

            {/* 알림음 설정 */}
            <View style={{ ...BaseStyle.mv10 }}>
              {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              주문마감 여부
              </Text> */}
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
                  onPress={() => setSetting({ ...setting, mt_sound: '3' })}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                >
                  <Image
                    source={
                      setting.mt_sound === '3'
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
                    }
                    style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                    resizeMode='contain'
                    fadeDuration={100}
                  />
                  <Text style={{ ...BaseStyle.ko14 }}>3회 울림</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({ ...setting, mt_sound: '5' })}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                >
                  <Image
                    source={
                      setting.mt_sound === '5'
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
                    }
                    style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                    resizeMode='contain'
                    fadeDuration={100}
                  />
                  <Text style={{ ...BaseStyle.ko14 }}>5회 울림</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => setSetting({ ...setting, mt_sound: '7' })}
                  hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                >
                  <Image
                    source={
                      setting.mt_sound === '7'
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
                    }
                    style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                    resizeMode='contain'
                    fadeDuration={100}
                  />
                  <Text style={{ ...BaseStyle.ko14 }}>7회 울림</Text>
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

            {/* 포장 가능 여부 */}
            <View style={{ ...BaseStyle.mv10 }}>
              {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              포장 가능 여부
              </Text> */}
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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

            {/* 쿠폰 사용 가능 여부 삭제요청(쿠폰등록 페이지로 이동 요청) */}
            <View style={{ ...BaseStyle.mv10 }}>
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
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
                    source={info.mb_one_saving === '1' ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')}
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
                    source={info.mb_one_saving === '0' ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')}
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
        <View style={{ ...BaseStyle.container, ...BaseStyle.ph20 }}>
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
      {storeInit ? (
        <TouchableOpacity
          activeOpacity={1}
          onPress={onModifyStoreSetting}
          style={{ ...BaseStyle.mainBtnBottom }}
        >
          <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
            수정하기
          </Text>
        </TouchableOpacity>
      ) : (
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
    </View>
  )
}

export default StoreSetting
