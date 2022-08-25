import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  KeyboardAvoidingView
} from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../CusToast'

const TipsEditModal = props => {
  const { getTips, isModalVisible, toggleModal } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  // 주문 금액 별 배달팁 설정
  const [tipIndex, setTipIndex] = React.useState(0) // 배달팁 index
  const [tipId, setTipId] = React.useState('') // 배달팁 ID
  const [minPrice, setMinPrice] = React.useState('') // 최소주문금액
  const [maxPrice, setMaxPrice] = React.useState('') // 최대주문금액
  const [deliveryPrice, setDeliveryPrice] = React.useState('') // 배달팁 금액

  // 할증 배달팁 설정
  const settingProps = () => {
    setTipId(props.dd_id)
    setTipIndex(props.index)
    setMinPrice(props.min)
    setMaxPrice(props.max)
    setDeliveryPrice(props.delivery)
  }

  React.useEffect(() => {
    settingProps()
    return () => settingProps()
  }, [props.dd_id, props.index, props.min, props.max, props.delivery])

  // 팁 수정
  function tipEditHandler () {
    // let toIntId = parseInt(tipId);
    const intMinPrice = parseInt(minPrice)
    const intMaxPrice = parseInt(maxPrice)
    const intDeliveryPrice = parseInt(deliveryPrice)

    if (maxPrice === null || maxPrice === '') {
      cusToast('구매 금액 범위 최대금액을 입력해주세요.')
    } else if (intMinPrice >= intMaxPrice) {
      cusToast('최소 금액은 최대 금액보다 낮게 입력해주세요.')
    } else if (intDeliveryPrice <= 0) {
      cusToast('배달비를 입력해주세요.')
    } else if (deliveryPrice === null || deliveryPrice === '') {
      cusToast('배달비를 입력해주세요.')
    } else {
      const param = {
        encodeJson: true,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        dd_id: tipId,
        charge_start: minPrice,
        charge_end: maxPrice,
        charge_price: deliveryPrice,
        mode: 'update'
      }

      Api.send('store_delivery_input', param, args => {
        const resultItem = args.resultItem
        // const arrItems = args.arrItems
        if (resultItem.result === 'Y') {
          toggleModal()
          getTips()
          cusToast('배달팁을 수정하였습니다.')
          setMinPrice('')
          setMaxPrice('')
          setDeliveryPrice('')
        } else {
          cusToast('배달팁을 수정할 수 없습니다.')
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
              배달팁{tipIndex + 1} - 수정하기
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
            <View style={{ width: '100%' }}>
              {/* 구매금액 범위 */}
              <View style={{ ...BaseStyle.mb10 }}>
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>구매 금액 범위</Text>
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
          </View>
          <View style={{ zIndex: -1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (minPrice !== '' && maxPrice !== '' && deliveryPrice !== '') {
                  tipEditHandler()
                } else {
                  return false
                }
              }}
              style={{
                ...BaseStyle.pv13,
                ...BaseStyle.mb30,
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
                width: '88%',
                alignSelf: 'center',
                zIndex: -1
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
                수정하기
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default TipsEditModal
