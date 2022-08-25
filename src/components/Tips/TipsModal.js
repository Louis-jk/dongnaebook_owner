import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView,
  Alert
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../CusToast'

const TipsModal = props => {
  const { navigation, isModalVisible, toggleModal, modalType, getTips } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  // 주문 금액 별 배달팁 설정
  const [minPrice, setMinPrice] = React.useState('') // 최소주문금액
  const [maxPrice, setMaxPrice] = React.useState('') // 최대주문금액
  const [deliveryPrice, setDeliveryPrice] = React.useState('') // 배달팁 금액

  // 주문 금액 별 배달팁 전송 API 붙이시면 됩니다.
  const sendConfirmHandler01 = () => {
    toggleModal()
    cusToast('주문 금액별 배달팁을 추가하였습니다.')
    // Alert.alert('주문 금액별 배달팁을 추가하였습니다.', '', [
    //   {
    //     text: '확인'
    //   }
    // ])
  }

  // 할증 배달팁 설정
  // 주문 금액
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(null)
  const [items, setItems] = React.useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ])

  // 요일
  const [dayOpen, setDayOpen] = React.useState(false)
  const [dayValue, setDayValue] = React.useState(null)
  const [dayItems, setDayItems] = React.useState([
    { label: '월요일', value: 'mon' },
    { label: '화요일', value: 'tue' },
    { label: '수요일', value: 'wed' },
    { label: '목요일', value: 'thu' },
    { label: '금요일', value: 'fri' },
    { label: '토요일', value: 'sat' },
    { label: '일요일', value: 'sun' }
  ])

  const deliTipPriceRef = React.useRef(null) // 추가 배달팁 금액 Reference
  const startTimeRef = React.useRef(null) // 시작 시간 Reference
  const endTimeRef = React.useRef(null) // 종료 시간 Reference
  const [deliTipPrice, setDeliTipPrice] = React.useState('') // 추가 배달팁 금액
  const [deliWeek, setDeliWeek] = React.useState('') // 요일 선택
  const [startTime, setStartTime] = React.useState('') // 시작 시간 선택
  const [endTime, setEndTime] = React.useState('') // 종료 시간 선택

  // 할증 배달팁 전송 API 붙이시면 됩니다.
  const sendConfirmHandler02 = () => {
    toggleModal()
    cusToast('할증 배달팁을 추가하였습니다.')
    // Alert.alert('할증 배달팁을 추가하였습니다.', '', [
    //   {
    //     text: '확인'
    //   }
    // ])
  }

  const tipAddHandler = () => {
    // let toIntId = parseInt(tipId);
    const intMinPrice = parseInt(minPrice)
    const intMaxPrice = parseInt(maxPrice)
    const intDeliveryPrice = parseInt(deliveryPrice)

    if (maxPrice === null || maxPrice === '') {
      cusToast('구매 금액 범위 최대금액을 입력해주세요.')
      // Alert.alert('구매 금액 범위 최대금액을 입력해주세요.', '', [
      //   {
      //     text: '확인'
      //   }
      // ])
    } else if (intMinPrice >= intMaxPrice) {
      cusToast('최소 금액은 최대 금액보다 낮게 입력해주세요.')
      // Alert.alert('최소 금액은 최대 금액보다 낮게 입력해주세요.', '', [
      //   {
      //     text: '확인'
      //   }
      // ])
    } else if (intDeliveryPrice <= 0) {
      cusToast('배달비를 입력해주세요.')
      // Alert.alert('배달비를 입력해주세요.', '', [
      //   {
      //     text: '확인'
      //   }
      // ])
    } else if (deliveryPrice === null || deliveryPrice === '') {
      cusToast('배달비를 입력해주세요.')
      // Alert.alert('배달비를 입력해주세요.', '', [
      //   {
      //     text: '확인'
      //   }
      // ])
    } else {
      const param = {
        encodeJson: true,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        charge_start: minPrice,
        charge_end: maxPrice,
        charge_price: deliveryPrice,
        mode: 'insert'
      }

      Api.send('store_delivery_input', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems
        if (resultItem.result === 'Y') {
          toggleModal()
          setMinPrice('')
          setMaxPrice('')
          setDeliveryPrice('')
          getTips()
          cusToast('배달팁을 추가하였습니다.')
        } else {
          cusToast('배달팁을 등록할 수 없습니다.')
        }
      })
    }
  }

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
      >
        <KeyboardAvoidingView
          behavior='position'
          style={{ backgroundColor: '#fff', borderRadius: 5 }}
          enabled
        >
          <View
            style={{
              backgroundColor: '#20ABC8',
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              ...BaseStyle.pv20,
              ...BaseStyle.ph20,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.textWhite }}>
              {modalType === 'minPrice' ? '주문 금액 별 배달팁 설정' : '할증 배달팁'}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleModal}
              style={{ position: 'absolute', top: 20, right: 20 }}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Image
                source={require('../../images/pop_close.png')}
                style={{ width: 22, height: 22 }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexWrap: 'wrap',
              ...BaseStyle.ph20,
              ...BaseStyle.pv20,
              backgroundColor: '#fff',
              borderBottomLeftRadius: 5,
              borderBottomRightRadius: 5
            }}
          >
            {modalType === 'deliveryTips' && (
              <>
                <View style={{ ...BaseStyle.mb30, width: '100%' }}>
                  <DropDownPicker
                    placeholder='주문금액'
                    placeholderStyle={{ ...BaseStyle.ko12 }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{ borderColor: '#E3E3E3', ...BaseStyle.inputH, ...BaseStyle.round05 }}
                  />
                </View>

                <View style={{ width: '100%' }}>
                  {/* 추가 배달팁 */}
                  <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                    <View style={{ width: '30%', ...BaseStyle.mr10 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>추가 배달팁</Text>
                    </View>
                    <View style={{ flex: 1.5, ...BaseStyle.mr10 }}>
                      <TextInput
                        ref={deliTipPriceRef}
                        value={deliTipPrice}
                        placeholder='금액입력'
                        style={{
                          ...BaseStyle.inputH,
                          ...BaseStyle.ph10,
                          ...BaseStyle.border,
                          ...BaseStyle.mb5
                        }}
                        onChangeText={text => {
                          const filteredText = text.replace(/(-)|(\.)/gi, '')

                          if (filteredText !== null || filteredText !== '') {
                            setDeliTipPrice(filteredText)
                          } else {
                            setDeliTipPrice('0')
                          }
                        }}
                        autoCapitalize='none'
                        keyboardType='number-pad'
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>원</Text>
                    </View>
                  </View>
                  {/* 추가 배달팁 */}

                  {/* 요일 */}
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
                    <View style={{ width: '30%', ...BaseStyle.mr10 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>요일</Text>
                    </View>
                    <View style={{ width: '50%' }}>
                      <DropDownPicker
                        placeholder='전체'
                        placeholderStyle={{ ...BaseStyle.ko12 }}
                        open={dayOpen}
                        value={dayValue}
                        items={dayItems}
                        setOpen={setDayOpen}
                        setValue={setDayValue}
                        setItems={setDayItems}
                        zIndex={100}
                        style={{
                          borderColor: '#E3E3E3',
                          ...BaseStyle.inputH,
                          ...BaseStyle.round05
                        }}
                      />
                    </View>
                  </View>
                  {/* // 요일 */}

                  {/* 시간 */}
                  <View style={{ ...BaseStyle.container3, zIndex: -1 }}>
                    <View style={{ width: '30%', ...BaseStyle.mr10 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>시간</Text>
                    </View>
                    <View style={{ flex: 3 }}>
                      <View style={{ ...BaseStyle.container5 }}>
                        <View style={{ flex: 1.5, ...BaseStyle.mr10 }}>
                          <TextInput
                            ref={startTimeRef}
                            value={startTime}
                            placeholder='시간 선택'
                            style={{
                              ...BaseStyle.inputH,
                              ...BaseStyle.ph10,
                              ...BaseStyle.border,
                              ...BaseStyle.mb5
                            }}
                            onChangeText={text => setStartTime(text)}
                            autoCapitalize='none'
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>부터</Text>
                        </View>
                      </View>
                      <View style={{ ...BaseStyle.container5 }}>
                        <View style={{ flex: 1.5, ...BaseStyle.mr10 }}>
                          <TextInput
                            ref={endTimeRef}
                            value={endTime}
                            placeholder='시간 선택'
                            style={{
                              ...BaseStyle.inputH,
                              ...BaseStyle.ph10,
                              ...BaseStyle.border,
                              ...BaseStyle.mb5
                            }}
                            onChangeText={text => setEndTime(text)}
                            autoCapitalize='none'
                          />
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>까지</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                  {/* // 시간 */}
                </View>
              </>
            )}

            {modalType === 'minPrice' && (
              <>
                <View style={{ width: '100%' }}>
                  {/* 구매금액 범위 */}
                  <View style={{ ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>
                      구매 금액 범위
                    </Text>
                  </View>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
                      <View style={{ flex: 1, ...BaseStyle.container, ...BaseStyle.mr5 }}>
                        <View
                          style={{
                            ...BaseStyle.container,
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#E3E3E3',
                            ...BaseStyle.round05,
                            ...BaseStyle.inputH,
                            ...BaseStyle.ph5
                          }}
                        >
                          <TextInput
                            value={minPrice}
                            placeholder='0'
                            placeholderTextColor='#222'
                            autoCapitalize='none'
                            style={{ width: '85%', textAlign: 'right' }}
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
                          />
                          <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>원</Text>
                        </View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.ml10 }}>이상</Text>
                      </View>

                      <View style={{ flex: 1, ...BaseStyle.container, ...BaseStyle.ml5 }}>
                        <View
                          style={{
                            ...BaseStyle.container,
                            flex: 1,
                            borderWidth: 1,
                            borderColor: '#E3E3E3',
                            ...BaseStyle.round05,
                            ...BaseStyle.inputH,
                            ...BaseStyle.ph5
                          }}
                        >
                          <TextInput
                            value={maxPrice}
                            placeholder='0'
                            placeholderTextColor='#222'
                            autoCapitalize='none'
                            keyboardType='number-pad'
                            style={{ width: '85%', textAlign: 'right' }}
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
                          />
                          <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>원</Text>
                        </View>
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.ml10 }}>미만</Text>
                      </View>
                    </View>
                  </View>
                  {/* 구매금액 범위 */}

                  {/* 배달비 */}
                  <View
                    style={{
                      ...BaseStyle.container,
                      ...BaseStyle.mb10,
                      alignSelf: 'flex-end',
                      marginRight: 30
                    }}
                  >
                    <View style={{ ...BaseStyle.mr10 }}>
                      <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>배달비</Text>
                    </View>
                    <View style={{ width: '41%', ...BaseStyle.container, ...BaseStyle.mr5 }}>
                      <View
                        style={{
                          ...BaseStyle.container,
                          flex: 1,
                          borderWidth: 1,
                          borderColor: '#E3E3E3',
                          ...BaseStyle.round05,
                          ...BaseStyle.inputH,
                          ...BaseStyle.ph5
                        }}
                      >
                        <TextInput
                          value={deliveryPrice}
                          placeholder='0'
                          placeholderTextColor='#222'
                          autoCapitalize='none'
                          style={{ width: '85%', textAlign: 'right' }}
                          onChangeText={text => {
                            const re = /^[0-9\b]+$/
                            if (text === '' || re.test(text)) {
                              const changed = text.replace(/(^0+)/, '')
                              setDeliveryPrice(changed)
                            } else {
                              setDeliveryPrice('0')
                            }
                          }}
                          keyboardType='number-pad'
                        />
                        <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>원</Text>
                      </View>
                    </View>
                  </View>
                  {/* //배달비 */}
                </View>
              </>
            )}
          </View>
          <View style={{ zIndex: -1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (minPrice !== '' && maxPrice !== '' && deliveryPrice !== '') {
                  tipAddHandler()
                } else {
                  return false
                }
              }}
              style={{
                zIndex: -1,
                borderRadius: 5,
                borderWidth: 1,
                borderColor:
                  minPrice !== '' && maxPrice !== '' && deliveryPrice !== ''
                    ? Primary.PointColor01
                    : '#ececec',
                backgroundColor:
                  minPrice !== '' && maxPrice !== '' && deliveryPrice !== ''
                    ? Primary.PointColor01
                    : '#ececec',
                justifyContent: 'center',
                alignItems: 'center',
                width: '87%',
                alignSelf: 'center',
                ...BaseStyle.pv13,
                ...BaseStyle.mb30
              }}
              // disabled={minPrice !== '' && maxPrice !== '' && deliveryPrice !== '' ? false : true}
            >
              <Text
                style={{
                  ...BaseStyle.ko15,
                  ...BaseStyle.font_bold,
                  color:
                    minPrice !== '' && maxPrice !== '' && deliveryPrice !== '' ? '#fff' : '#aaa'
                }}
              >
                등록하기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default TipsModal
