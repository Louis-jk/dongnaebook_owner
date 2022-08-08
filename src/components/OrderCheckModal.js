import * as React from 'react'
import { View, Text, TouchableOpacity, TextInput, Image, Alert } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import * as orderAction from '../redux/actions/orderAction'

const OrderCheckModal = ({
  isModalVisible,
  toggleModal,
  oderId,
  orderType,
  navigation,
  jumjuId,
  jumjuCode
}) => {
  const [time01, setTime01] = React.useState('')
  const [time02, setTime02] = React.useState('')
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
      od_process_status: '신규주문'
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

  const checkOrderHandler = () => {
    const param = {
      encodeJson: true,
      od_id: oderId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: '접수완료',
      delivery_time: time01,
      visit_time: time02
    }

    // proc_store_order_status_update
    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getOrderListHandler()
        toggleModal()
        Alert.alert('주문을 접수하였습니다.', '', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home', { screen: 'Main' })
          }
        ])
      } else {
        getOrderListHandler()
        toggleModal()
        Alert.alert('주문 접수중 오류가 발생하였습니다.', '다시 한번 시도해주세요.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home', { screen: 'Main' })
          }
        ])
      }
    })
  }

  return (
    <View>
      {/* 주문 접수 모달 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
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
            onPress={toggleModal}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: Primary.PointColor02,
              borderRadius: 50,
              padding: 10
            }}
          >
            <Image
              source={require('../images/close_wh.png')}
              style={{ width: 10, height: 10 }}
              resizeMode='center'
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb15 }}>
            {orderType === '배달'
              ? '배달 예상시간을 입력해주세요.'
              : '포장 예상시간을 입력해주세요.'}
          </Text>
          <View style={{ width: '100%', ...BaseStyle.ph30 }}>
            <View
              style={{
                ...BaseStyle.container5,
                ...BaseStyle.ph10,
                ...BaseStyle.inputH,
                ...BaseStyle.border
              }}
            >
              <TextInput
                ref={deliveryTimeRef}
                value={orderType === '배달' ? time01 : time02}
                style={{ width: '83%', textAlign: 'right' }}
                placeholder='예: 30'
                onChangeText={text => {
                  const filteredText = text.replace(/(-)|(\.)/gi, '')
                  if (filteredText !== null || filteredText !== '') {
                    if (orderType === '배달') {
                      setTime01(filteredText)
                    } else {
                      setTime02(filteredText)
                    }
                  } else {
                    if (orderType === '배달') {
                      setTime01('0')
                    } else {
                      setTime02('0')
                    }
                  }
                }}
                autoCapitalize='none'
                keyboardType='number-pad'
              />
              <Text>분 {orderType === '배달' ? '예상' : '후'}</Text>
            </View>
          </View>
          <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph30 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={checkOrderHandler}
              style={{
                ...BaseStyle.mainBtn,
                flex: 1,
                ...BaseStyle.pv15,
                borderRadius: 5
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
