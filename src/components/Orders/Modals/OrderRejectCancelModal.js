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
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import BaseStyle from '../../../styles/Base'
import Api from '../../../Api'
import * as orderAction from '../../../redux/actions/orderAction'
import cusToast from '../../CusToast'
import { rejectTypes, rejectTypes02, cancelTypes, cancelTypes02, cancelTypes03 } from '../../../data/order/rejectAndCancelType'
import Steps from '../../../data/order/steps'
import Types from '../../../data/order/types'

const OrderRejectCancelModal = props => {
  const {
    navigation,
    isModalVisible,
    closeModal,
    modalType,
    orderId,
    jumjuId,
    jumjuCode,
    orderType
  } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const dispatch = useDispatch()

  // 주문 거부일 경우 기타 입력부분
  const directTypeRef = React.useRef(null)
  const [typeEtc, setTypeEtc] = React.useState('')

  // 주문 거부/취소 타입 선택
  const [selectedType, setSelectType] = React.useState('')
  const setSelectTypeHandler = payload => {
    if (payload !== 6) {
      setSelectType(payload)
      setTypeEtc('')
      if (modalType !== 'cancel') {
        directTypeRef.current.blur()
      }
    } else {
      setSelectType(payload)
      directTypeRef.current.focus()
    }
  }

  React.useEffect(() => {
    setSelectType('')
    setTypeEtc('')
  }, [isModalVisible])

  const getOrderListHandler = () => {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      od_process_status: Steps[0]
    }

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)))
      } else {
        dispatch(orderAction.updateNewOrder(null))
      }
    })
  }

  // 주문 거부 재확인 확인 후 실행 핸들러
  const rejectSendHandler = () => {
    let rejectTxt = ''
    if (orderType === Types[0].text) {
      rejectTxt = rejectTypes.filter(reject => reject.type_id === selectedType)
    }

    if (orderType !== Types[0].text) {
      rejectTxt = rejectTypes02.filter(reject => reject.type_id === selectedType)
    }

    let filteredText = ''
    if (rejectTxt[0].type_id !== 6) {
      filteredText = rejectTxt[0].type_description
    } else {
      filteredText = typeEtc
    }

    const param = {
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      mode: 'cancle',
      od_id: orderId,
      od_cancle_memo: filteredText
    }

    Api.send('store_order_cancle', param, args => {
      const resultItem = args.resultItem
      
      getOrderListHandler()

      if (resultItem.result === 'Y') {
        cusToast('주문을 거부하였습니다.')
      } else {
        cusToast('주문을 거부하는 중에 문제가 발생하였습니다.\n다시 시도해주세요.')
      }

      navigation.navigate('Home', { screen: 'Main' })
      
    })
  }

  // 주문 거부 API 붙이시면 됩니다.
  const rejectConfirmHandler = () => {
    closeModal()
    Alert.alert('주문을 정말 거부하시겠습니까?', '거부하신 주문은 복구하실 수 없습니다.', [
      {
        text: '아니요'
      },
      {
        text: '네 거부할게요',
        onPress: () => rejectSendHandler()
      }
    ])
  }

  const getOrderListHandler02 = () => {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      od_process_status: Steps[1]
    }

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)))
      } else {
        dispatch(orderAction.updateCheckOrder(null))
      }
    })
  }

  // 주문 취소 재확인 확인 후 실행 핸들러
  const cancelSendHandler = () => {
    let rejectTxt = ''
    if (orderType === Types[0].text) {
      rejectTxt = cancelTypes.filter(reject => reject.type_id === selectedType)
    }

    if (orderType === Types[1].text) {
      rejectTxt = cancelTypes02.filter(reject => reject.type_id === selectedType)
    }

    if (orderType === Types[2].text) {
      rejectTxt = cancelTypes03.filter(reject => reject.type_id === selectedType)
    }

    let filteredText = ''
    if (rejectTxt[0].type_id !== 6) {
      filteredText = rejectTxt[0].type_description
    } else {
      filteredText = typeEtc
    }

    const param = {
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      mode: 'cancle',
      od_id: orderId,
      od_cancle_memo: filteredText
    }
    

    Api.send('store_order_cancle', param, args => {
      const resultItem = args.resultItem
      
      getOrderListHandler02()

      if (resultItem.result === 'Y') {
        cusToast('주문을 취소하였습니다.')
      } else {
        cusToast('주문을 취소하는 중에 문제가 생겼습니다.\n관리자에게 문의해주세요.')
      }

      navigation.navigate('Home', { screen: 'Main' })
      
    })
  }

  // 주문 취소 API 붙이시면 됩니다.
  const cancelConfirmHandler = () => {
    closeModal()
    Alert.alert('주문을 정말 취소하시겠습니까?', '취소하신 주문은 복구하실 수 없습니다.', [
      {
        text: '네 취소할게요',
        onPress: () => cancelSendHandler()
      },
      {
        text: '아니요'
      }
    ])
  }

  return (
    <View>
      <Modal
        isVisible={isModalVisible}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='slideInUp'
        animationInTiming={100}
      >
        <KeyboardAvoidingView
          behavior='position'
          style={{ backgroundColor: '#fff', borderRadius: 5 }}
          enabled
        >
          <View
            style={{
              backgroundColor: orderType === Types[0].text ? Types[0].color : orderType === Types[1].text ? Types[1].color : Types[2].color,
              borderTopRightRadius: 5,
              borderTopLeftRadius: 5,
              ...BaseStyle.pv30,
              ...BaseStyle.ph20,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
              {`주문 ${modalType === 'reject' ? '거부' : '취소'} 사유를 선택해주세요`}
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={closeModal}
              style={{ position: 'absolute', top: 20, right: 20 }}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Image
                source={require('../../../images/pop_close.png')}
                style={{ width: 22, height: 22 }}
                resizeMode='contain'
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              ...BaseStyle.container4,
              flexWrap: 'wrap',
              ...BaseStyle.ph20,
              ...BaseStyle.pv20,
              backgroundColor: '#fff',
              borderBottomLeftRadius: modalType === 'reject' ? 0 : 5,
              borderBottomRightRadius: modalType === 'reject' ? 0 : 5
            }}
          >
            {modalType === 'reject' && orderType === Types[0].text &&
              rejectTypes &&
              rejectTypes.length > 0 &&
              rejectTypes.map((type, index) => (
                <TouchableOpacity
                  key={type.type_id}
                  activeOpacity={0.8}
                  onPress={() => setSelectTypeHandler(type.type_id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: selectedType === type.type_id ? '#707070' : '#F3F3F3',
                    backgroundColor: selectedType === type.type_id ? '#fff' : '#F3F3F3',
                    width: '48%',
                    height: 55,
                    ...BaseStyle.mb10,
                    marginRight: index % 2 === 0 ? '1%' : 0,
                    marginLeft: index % 2 === 1 ? '1%' : 0
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.font_222,
                      ...BaseStyle.lh17,
                      textAlign: 'center',
                      color: selectedType === type.type_id ? '#000' : '#333'
                    }}
                  >
                    {type.type_description}
                  </Text>
                </TouchableOpacity>
              ))}

            {modalType === 'reject' && orderType !== Types[0].text &&
              rejectTypes02 &&
              rejectTypes02.length > 0 &&
              rejectTypes02.map((type, index) => (
                <TouchableOpacity
                  key={type.type_id}
                  activeOpacity={0.8}
                  onPress={() => setSelectTypeHandler(type.type_id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: selectedType === type.type_id ? '#707070' : '#F3F3F3',
                    backgroundColor: selectedType === type.type_id ? '#fff' : '#F3F3F3',
                    width: '48%',
                    height: 55,
                    ...BaseStyle.mb10,
                    marginRight: index % 2 === 0 ? '1%' : 0,
                    marginLeft: index % 2 === 1 ? '1%' : 0
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.font_222,
                      ...BaseStyle.lh17,
                      textAlign: 'center',
                      color: selectedType === type.type_id ? '#000' : '#333'
                    }}
                  >
                    {type.type_description}
                  </Text>
                </TouchableOpacity>
              ))}

            {modalType === 'cancel' && orderType === Types[0].text &&
              cancelTypes &&
              cancelTypes.length > 0 &&
              cancelTypes.map((type, index) => (
                <TouchableOpacity
                  key={type.type_id}
                  activeOpacity={0.8}
                  onPress={() => setSelectTypeHandler(type.type_id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: selectedType === type.type_id ? '#707070' : '#F3F3F3',
                    backgroundColor: selectedType === type.type_id ? '#fff' : '#F3F3F3',
                    width: '48%',
                    height: 55,
                    ...BaseStyle.mb10,
                    marginRight: index % 2 === 0 ? '2%' : 0,
                    marginLeft: index % 2 === 1 ? '2%' : 0
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.font_222,
                      ...BaseStyle.lh17,
                      textAlign: 'center'
                    }}
                  >
                    {type.type_description}
                  </Text>
                </TouchableOpacity>
              ))}

            {modalType === 'cancel' && orderType === Types[1].text &&
              cancelTypes02 &&
              cancelTypes02.length > 0 &&
              cancelTypes02.map((type, index) => (
                <TouchableOpacity
                  key={type.type_id}
                  activeOpacity={0.8}
                  onPress={() => setSelectTypeHandler(type.type_id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: selectedType === type.type_id ? '#707070' : '#F3F3F3',
                    backgroundColor: selectedType === type.type_id ? '#fff' : '#F3F3F3',
                    width: '48%',
                    height: 55,
                    ...BaseStyle.mb10,
                    marginRight: index % 2 === 0 ? '2%' : 0,
                    marginLeft: index % 2 === 1 ? '2%' : 0
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.font_222,
                      ...BaseStyle.lh17,
                      textAlign: 'center'
                    }}
                  >
                    {type.type_description}
                  </Text>
                </TouchableOpacity>
              ))}

            {modalType === 'cancel' && orderType === Types[2].text &&
              cancelTypes03 &&
              cancelTypes03.length > 0 &&
              cancelTypes03.map((type, index) => (
                <TouchableOpacity
                  key={type.type_id}
                  activeOpacity={0.8}
                  onPress={() => setSelectTypeHandler(type.type_id)}
                  style={{
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 5,
                    borderWidth: 1,
                    borderColor: selectedType === type.type_id ? '#707070' : '#F3F3F3',
                    backgroundColor: selectedType === type.type_id ? '#fff' : '#F3F3F3',
                    width: '48%',
                    height: 55,
                    ...BaseStyle.mb10,
                    marginRight: index % 2 === 0 ? '2%' : 0,
                    marginLeft: index % 2 === 1 ? '2%' : 0
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.font_222,
                      ...BaseStyle.lh17,
                      textAlign: 'center'
                    }}
                  >
                    {type.type_description}
                  </Text>
                </TouchableOpacity>
              ))}
          </View>

          {modalType === 'reject' && (
            <View style={{ ...BaseStyle.ph20, ...BaseStyle.mb10 }}>
              <TextInput
                ref={directTypeRef}
                value={typeEtc}
                placeholder='직접입력'
                style={{
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.border,
                  ...BaseStyle.mb5
                }}
                onChangeText={text => setTypeEtc(text)}
                autoCapitalize='none'
                onFocus={() => setSelectType(6)}
                // onSubmitEditing={() => userPwdReRef.current.focus()}
              />
            </View>
          )}

          <View style={{ zIndex: -1, ...BaseStyle.ph20 }}>
            {modalType === 'reject' && selectedType !== 6 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (selectedType !== null && selectedType !== '') {
                    rejectConfirmHandler()
                  } else {
                    return false
                  }
                }}
                style={{
                  ...BaseStyle.pv15,
                  ...BaseStyle.mb30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  alignSelf: 'center',
                  borderColor: selectedType !== null && selectedType !== '' && orderType === Types[0].text ? Types[0].color
                    : selectedType !== null && selectedType !== '' && orderType === Types[1].text ? Types[1].color
                      : selectedType !== null && selectedType !== '' && orderType === Types[2].text ? Types[2].color
                        : '#E3E3E3',
                  borderRadius: 5,
                  borderWidth: 1,
                  backgroundColor: selectedType !== null && selectedType !== '' && orderType === Types[0].text ? Types[0].color
                    : selectedType !== null && selectedType !== '' && orderType === Types[1].text ? Types[1].color
                      : selectedType !== null && selectedType !== '' && orderType === Types[2].text ? Types[2].color
                        : '#fff'
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_666,
                    color: selectedType !== null && selectedType !== '' ? '#fff' : '#ccc'
                  }}
                >
                  거부하기
                </Text>
              </TouchableOpacity>
            )}

            {modalType === 'reject' && selectedType === 6 && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (typeEtc !== null && typeEtc !== '') {
                    rejectConfirmHandler()
                  } else {
                    return false
                  }
                }}
                style={{
                  ...BaseStyle.pv15,
                  ...BaseStyle.mb30,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  alignSelf: 'center',
                  borderColor: typeEtc !== null && typeEtc !== '' && orderType === Types[0].text ? Types[0].color
                    : typeEtc !== null && typeEtc !== '' && orderType === Types[1].text ? Types[1].color
                      : typeEtc !== null && typeEtc !== '' && orderType === Types[2].text ? Types[2].color
                        : '#E3E3E3',
                  borderRadius: 5,
                  borderWidth: 1,
                  backgroundColor: typeEtc !== null && typeEtc !== '' && orderType === Types[0].text ? Types[0].color
                    : typeEtc !== null && typeEtc !== '' && orderType === Types[1].text ? Types[1].color
                      : typeEtc !== null && typeEtc !== '' && orderType === Types[2].text ? Types[2].color
                        : '#fff'
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko15,
                    ...BaseStyle.font_666,
                    color: typeEtc !== null && typeEtc !== '' ? '#fff' : '#ccc'
                  }}
                >
                  거부하기
                </Text>
              </TouchableOpacity>
            )}

            {modalType === 'cancel' && (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  if (selectedType !== null && selectedType !== '') {
                    cancelConfirmHandler()
                  } else {
                    return false
                  }
                }}
                style={{
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: selectedType !== null && selectedType !== '' && orderType === Types[0].text ? Types[0].color
                    : selectedType !== null && selectedType !== '' && orderType === Types[1].text ? Types[1].color
                      : selectedType !== null && selectedType !== '' && orderType === Types[2].text ? Types[2].color
                        : '#E3E3E3',
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: '100%',
                  alignSelf: 'center',
                  ...BaseStyle.pv15,
                  ...BaseStyle.mb30,
                  backgroundColor: selectedType !== null && selectedType !== '' && orderType === Types[0].text ? Types[0].color
                    : selectedType !== null && selectedType !== '' && orderType === Types[1].text ? Types[1].color
                      : selectedType !== null && selectedType !== '' && orderType === Types[2].text ? Types[2].color
                        : '#fff'
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.font_666,
                    color: selectedType !== null && selectedType !== '' ? '#fff' : '#ccc'
                  }}
                >
                  취소하기
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  )
}

export default OrderRejectCancelModal
