import { View, Text, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import BaseStyle from '../../../styles/Base'
import Types from '../../../data/order/types'

const OrderButtons = ({
  tabIndex,
  item,
  setOrderId,
  setOrderType,
  setJumjuId,
  setJumjuCode,
  toggleOrderCheckModal,
  toggleModal,
  deliveryOrderHandler,
  navigation
}) => {
  return (
    <>
      {tabIndex === 1 && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOrderId(item.od_id)
              setOrderType(item.od_type)
              setJumjuId(item.jumju_id)
              setJumjuCode(item.jumju_code)
              toggleOrderCheckModal()
            }}
            style={{
              backgroundColor: item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text
              style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}
            >
              {item.od_type}접수
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOrderId(item.od_id)
              setOrderType(item.od_type)
              setJumjuId(item.jumju_id)
              setJumjuCode(item.jumju_code)
              toggleModal('reject')
            }}
            style={{
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              borderWidth: 1,
              borderColor: '#E3E3E3',
              backgroundColor: '#fff'
            }}
          >
            <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}>
              주문거부
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {tabIndex === 2 && (
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOrderId(item.od_id)
              deliveryOrderHandler(item.od_type, item.od_id, item.jumju_id, item.jumju_code)
            }}
            style={{
              backgroundColor:
                    item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko13,
                ...BaseStyle.font_bold,
                color: '#fff',
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              {/* {item.od_type === Types[0].text ? '배달처리' : item.od_type === Types[1].text ? '포장완료' : '식사완료'} */}
              {item.od_type}처리
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setOrderType(item.od_type)
              setOrderId(item.od_id)
              setJumjuId(item.jumju_id)
              setJumjuCode(item.jumju_code)
              toggleModal('cancel')
            }}
            style={{
              backgroundColor: '#fff',
              width: 80,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              borderWidth: 1,
              borderColor: '#E3E3E3',
              ...BaseStyle.round05
            }}
          >
            <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666, marginBottom: Platform.OS === 'ios' ? 4 : 0 }}>
              주문취소
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {tabIndex === 3 && (
        <View style={{ flex: 1, alignSelf: 'flex-start' }}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={async () => {
              await setOrderId(item.od_id)
              await setJumjuId(item.jumju_id)
              await setJumjuCode(item.jumju_code)
              await deliveryOrderHandler()
            }}
            style={{
              backgroundColor:
          item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
              width: 80,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text
              style={{
                textAlign: 'center',
                ...BaseStyle.ko13,
                ...BaseStyle.lh20,
                ...BaseStyle.font_bold,
                color: '#fff',
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              완료처리
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {tabIndex === 4 && (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => navigation.navigate('OrderDetail', {
            od_id: item.od_id,
            od_time: item.od_time,
            type: 'done',
            jumjuId: item.jumju_id,
            jumjuCode: item.jumju_code
          })}
          style={{ flex: 1, alignSelf: 'flex-start' }}>
          <View
            style={{
              backgroundColor:
          item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
              width: 80,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko13,
                ...BaseStyle.font_bold,
                color: '#fff',
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              {item.od_type}완료
            </Text>
          </View>
        </TouchableOpacity>
      )}

      {tabIndex === 5 && (
        <TouchableOpacity 
          activeOpacity={1}
          onPress={() => navigation.navigate('OrderDetail', {
            od_id: item.od_id,
            od_time: item.od_time,
            type: 'cancel',
            jumjuId: item.jumju_id,
            jumjuCode: item.jumju_code
          })}
          style={{ flex: 1, alignSelf: 'flex-start' }}>
          <View
            style={{
              backgroundColor:
          item.od_type === Types[0].text ? Types[0].color : item.od_type === Types[1].text ? Types[1].color : Types[2].color,
              width: 80,
              height: 70,
              justifyContent: 'center',
              alignItems: 'center',
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5
            }}
          >
            <Text
              style={{
                ...BaseStyle.ko13,
                ...BaseStyle.font_bold,
                color: '#fff',
                marginBottom: Platform.OS === 'ios' ? 4 : 0
              }}
            >
              {item.od_type}취소
            </Text>
          </View>
        </TouchableOpacity>
      )}
    </>
  )
}

export default OrderButtons
