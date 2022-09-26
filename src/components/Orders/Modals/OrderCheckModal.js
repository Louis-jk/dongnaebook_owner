import * as React from 'react'
import { View, Text, TouchableOpacity, TextInput, Image, Platform, Alert } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import BaseStyle, { Primary } from '../../../styles/Base'
import Api from '../../../Api'
import * as orderAction from '../../../redux/actions/orderAction'
import cusToast from '../../CusToast'
import { deliveryTimes, takeoutTimes } from '../../../data/order/selectTime'
import Types from '../../../data/order/types'
import Steps from '../../../data/order/steps'

const OrderCheckModal = ({
  isModalVisible,
  closeModal,
  oderId,
  orderType,
  navigation,
  jumjuId,
  jumjuCode
}) => {
  const [isTimeSelected, setTimeSelected] = React.useState(false)
  const [time01Selcet, setTime01Select] = React.useState('') // 배달 시간 선택
  const [time02Selcet, setTime02Select] = React.useState('') // 포장 시간 선택
  const [time03Selcet, setTime03Select] = React.useState('') // 식사 시간 선택
  const [time01, setTime01] = React.useState('') // 배달 시간 직접 입력
  const [time02, setTime02] = React.useState('') // 포장 시간 직접 입력
  const [time03, setTime03] = React.useState('') // 식사 시간 직접 입력
  const deliveryTimeRef = React.useRef(null)

  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const dispatch = useDispatch()

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

  const checkOrderHandler = (type, time) => {

    closeModal()
    
    const param = {
      encodeJson: true,
      od_id: oderId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: Steps[1]
    }

    if (type === Types[0].text) {
      param.delivery_time = time
    }

    if (type === Types[1].text || type === Types[2].text) {
      param.visit_time = time
    }

    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem
      
      if (resultItem.result === 'Y') {
        cusToast('주문을 접수하였습니다.')
      } else {
        cusToast('주문 접수중 오류가 발생하였습니다.\n다시 한번 시도해주세요.')
      }

      getOrderListHandler()      

      navigation.navigate('Home', { screen: 'Main' })
      
    })
  }

  const checkValidate = () => {

    let time = '';

    if (orderType === Types[0].text) {
      if(isTimeSelected) {
        if(time01Selcet !== '') {
          time = time01Selcet
        } else {
          Alert.alert('시간을 선택해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      } else {
        if(time01 !== '') {
          time = time01
        } else {
          Alert.alert('시간을 지정 또는 입력해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      }
    }
    
    if (orderType === Types[1].text) {
      if(isTimeSelected) {
        if(time02Selcet !== '') {
          time = time02Selcet
        } else {
          Alert.alert('시간을 선택해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      } else {
        if(time02 !== '') {
          time = time02
        } else {
          Alert.alert('시간을 지정 또는 입력해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      }
    }

    if (orderType === Types[2].text) {
      if(isTimeSelected) {
        if(time03Selcet !== '') {
          time = time03Selcet
        } else {
          Alert.alert('시간을 선택해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      } else {
        if(time03 !== '') {
          time = time03
        } else {
          Alert.alert('시간을 지정 또는 입력해주세요.', '', [
            {
              text: '확인'
            }
          ])
          return;
        }
      }
    }

    checkOrderHandler(orderType, time)
  }


  return (
    <View>
      {/* 주문 접수 모달 */}
      <Modal
        isVisible={isModalVisible}
        // onBackdropPress={closeModal}
        transparent
        statusBarTranslucent={false}
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='slideInUp'
        animationInTiming={100}
      >
        <View
          style={{
            position: 'relative',
            backgroundColor: '#fff',
            ...BaseStyle.pv30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 15
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={closeModal}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: orderType === Types[0].text ? Types[0].color : orderType === Types[1].text ? Types[1].color : Types[2].color,
              borderRadius: 50,
              padding: 10
            }}
          >
            <Image
              source={require('../../../images/close_wh.png')}
              style={{ width: 10, height: 10 }}
              resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb15 }}>
            {orderType === Types[0].text
              ? '배달출발 예상시간을 입력해주세요.'
              : orderType === '포장'
                ? '포장완료 예상시간을 입력해주세요.'
                : '식사가능 예상시간을 입력해주세요.'}
          </Text>

          {/* 시간 선택 영역 */}
          <View style={{ ...BaseStyle.container0, flexWrap: 'wrap', paddingHorizontal: 25 }}>
            {orderType === Types[0].text && deliveryTimes.map((time, index) => (
              <View
                key={`deliveryTime-${time}-${index}`}
                style={{ width: '50%', backgroundColor: '#fff' }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setTime01('')
                    setTimeSelected(true)
                    setTime01Select(time)
                  }}
                  style={{
                    ...BaseStyle.container0,
                    height: 40,
                    ...BaseStyle.mh05,
                    ...BaseStyle.mv5,
                    backgroundColor: time01Selcet === time ? Types[0].color : Primary.PointColor03,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: time01Selcet === time ? '#fff' : '#222' }}>{time}분</Text>
                </TouchableOpacity>
              </View>
            ))}

            {orderType === Types[1].text && takeoutTimes.map((time, index) => (
              <View
                key={`deliveryTime-${time}-${index}`}
                style={{ width: '50%', backgroundColor: '#fff' }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setTime02('')
                    setTimeSelected(true)
                    setTime02Select(time)
                  }}
                  style={{
                    ...BaseStyle.container0,
                    height: 40,
                    ...BaseStyle.mh05,
                    ...BaseStyle.mv5,
                    backgroundColor: time02Selcet === time ? Types[1].color : Primary.PointColor03,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: time02Selcet === time ? '#fff' : '#222' }}>{time}분</Text>
                </TouchableOpacity>
              </View>
            ))}

            {orderType === Types[2].text && takeoutTimes.map((time, index) => (
              <View
                key={`deliveryTime-${time}-${index}`}
                style={{ width: '50%', backgroundColor: '#fff' }}
              >
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={() => {
                    setTime03('')
                    setTimeSelected(true)
                    setTime03Select(time)
                  }}
                  style={{
                    ...BaseStyle.container0,
                    height: 40,
                    ...BaseStyle.mh05,
                    ...BaseStyle.mv5,
                    backgroundColor: time03Selcet === time ? Types[2].color : Primary.PointColor03,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: time03Selcet === time ? '#fff' : '#222' }}>{time}분</Text>
                </TouchableOpacity>
              </View>
            ))}

          </View>
          {/* // 시간 선택 영역 */}

          <View style={{ width: '100%', ...BaseStyle.ph30 }}>

            <View
              style={{
                ...BaseStyle.container5,
                ...BaseStyle.ph10,
                ...BaseStyle.inputH,
                ...BaseStyle.border,
                ...BaseStyle.mt10
              }}
            >
              <TextInput
                ref={deliveryTimeRef}
                value={orderType === Types[0].text ? time01 : orderType === Types[1].text ? time02 : time03}
                style={{ width: '83%', textAlign: 'right' }}
                placeholder='직접입력 예: 30'
                onChangeText={text => {
                  const filteredText = text.replace(/(-)|(\.)/gi, '')
                  if (filteredText !== null || filteredText !== '') {
                    if (orderType === Types[0].text) {
                      setTime01Select('')
                      setTime01(filteredText)
                    } else if (orderType === Types[1].text) {
                      setTime02Select('')
                      setTime02(filteredText)
                    } else {
                      setTime03Select('')
                      setTime03(filteredText)
                    }
                    setTimeSelected(false)
                  } else {
                    if (orderType === Types[0].text) {
                      setTime01('0')
                    } else if (orderType === Types[1].text) {
                      setTime02('0')
                    } else {
                      setTime03('0')
                    }
                  }
                }}
                autoCapitalize='none'
                keyboardType='number-pad'
              />
              <Text>분 후</Text>
            </View>
          </View>
          <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph30 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={checkValidate}
              style={{
                ...BaseStyle.mainBtn,
                flex: 1,
                ...BaseStyle.pv15,
                borderRadius: 5,
                backgroundColor: orderType === Types[0].text ? Types[0].color : orderType === Types[1].text ? Types[1].color : Types[2].color
              }}
            >
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
                전송하기
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* // 주문 접수 모달 */}
    </View>
  )
}

export default OrderCheckModal
