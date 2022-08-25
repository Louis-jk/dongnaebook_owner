import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import Api from '../../../Api'
import BaseStyle, { Primary } from '../../../styles/Base'
import cusToast from '../../CusToast'
import { useDispatch } from 'react-redux'
import * as orderAction from '../../../redux/actions/orderAction'

const DeliveryConfirmationModal = ({
  isModalVisible,
  toggleModal,
  orderType,
  oderId,
  jumjuId,
  jumjuCode,
  navigation
}) => {
  const dispatch = useDispatch()
  // 주문 배달처리
  const sendDeliverHandler = () => {
    const param = {
      od_id: oderId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: orderType === '배달' ? '배달중' : '포장완료'
    }

    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem

      console.log('배달 | 포장 처리 resultItem ?', resultItem)

      if (resultItem.result === 'Y') {
        dispatch(orderAction.initCheckOrderLimit(5))
        dispatch(orderAction.getCheckOrder())
        toggleModal()
        cusToast(`주문을 ${orderType === '배달' ? '배달' : '포장완료'} 처리하였습니다.`)
      } else {
        dispatch(orderAction.initCheckOrderLimit(5))
        dispatch(orderAction.getCheckOrder())
        toggleModal()
        cusToast(`주문 ${orderType === '배달' ? '배달' : '포장완료'} 처리중 오류가 발생하였습니다.\n다시 한번 시도해주세요.`)
      }

      setTimeout(() => {
        navigation.navigate('Home', { screen: 'Main' })
      }, 1500)
    })
  }

  return (
    <View>
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
              source={require('../../../images/close_wh.png')}
              style={{ width: 10, height: 10 }}
              resizeMode='center'
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb15 }}>
            주문을 {orderType === '배달' ? orderType : '포장완료'} 처리하시겠습니까?
          </Text>

          {/* 배달처리 | 취소 버튼 영역 */}
          <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleModal}
              style={{ flex: 1, ...BaseStyle.pv15, backgroundColor: Primary.PointColor03, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
            >
              <Text style={{ textAlign: 'center', ...BaseStyle.ko14 }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={sendDeliverHandler}
              style={{ flex: 1, ...BaseStyle.pv15, backgroundColor: orderType === '배달' ? Primary.PointColor01 : Primary.PointColor02, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
            >
              <Text style={{ textAlign: 'center', ...BaseStyle.ko14, ...BaseStyle.font_white }}>{orderType === '배달' ? orderType : '포장완료'}처리</Text>
            </TouchableOpacity>
          </View>
          {/* // 배달처리 | 취소 버튼 영역 */}
        </View>
      </Modal>

    </View>
  )
}

export default DeliveryConfirmationModal
