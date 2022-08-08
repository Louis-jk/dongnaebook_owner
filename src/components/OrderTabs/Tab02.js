import { View, Text, FlatList, TouchableOpacity, Image, Alert, Dimensions } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import OrderRejectCancelModal from '../OrderRejectCancelModal'

const Tab02 = props => {
  const { navigation, getOrderListHandler } = props
  const { checkOrder } = useSelector(state => state.order) // 접수완료 건
  const [jumjuId, setJumjuId] = React.useState('') // 해당 점주 아이디
  const [jumjuCode, setJumjuCode] = React.useState('') // 해당 점주 코드

  // 주문 건
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [refleshing, setReflashing] = React.useState(false)

  // 주문 배달처리
  const sendDeliverHandler = (type, odId, jumjuId, jumjuCode) => {
    const param = {
      od_id: odId,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: type === '배달' ? '배달중' : '포장완료'
      // delivery_time: time01,
      // visit_time: time02
    }

    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getOrderListHandler(1)
        Alert.alert(`주문을 ${type === '배달' ? '배달' : '포장완료'} 처리하였습니다.`, '', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home', { screen: 'Main' })
          }
        ])
      } else {
        getOrderListHandler(1)
        Alert.alert(
          `주문 ${type === '배달' ? '배달' : '포장완료'} 처리중 오류가 발생하였습니다.`,
          '다시 한번 시도해주세요.',
          [
            {
              text: '확인',
              onPress: () => navigation.navigate('Home', { screen: 'Main' })
            }
          ]
        )
      }
    })
  }

  const deliveryOrderHandler = (type, orderId, jumjuId, jumjuCode) => {
    if (type === '배달') {
      Alert.alert('주문을 배달 처리하시겠습니까?', '', [
        {
          text: '네 배달처리',
          onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode)
        },
        {
          text: '아니요'
        }
      ])
    } else {
      Alert.alert('주문을 포장완료 처리하시겠습니까?', '', [
        {
          text: '네 포장완료',
          onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode)
        },
        {
          text: '아니요'
        }
      ])
    }
  }

  // 주문 취소
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')

  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }

  const onHandleRefresh = () => {
    setReflashing(true)
    // getOrderListHandler()
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={item.od_id + index}>
        <View
          style={{
            backgroundColor: '#F8F8F8',
            width: '100%',
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10
          }}
        >
          <Text style={{ ...BaseStyle.ko12 }}>
            {moment(item.od_time).format('YYYY년 M월 D일 HH:mm')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 3, paddingRight: 20 }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'doing',
                jumjuId: item.jumju_id,
                jumjuCode: item.jumju_code
              })}
          >
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{item.mb_company}</Text>
              <View
                style={{
                  ...BaseStyle.pv2,
                  ...BaseStyle.ph5,
                  ...BaseStyle.ml10,
                  borderRadius: 5,
                  backgroundColor:
                    item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02
                }}
              >
                <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
              </View>
            </View>
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
            <View style={{ ...BaseStyle.container }}>
              <Text
                style={[
                  { ...BaseStyle.ko12 },
                  item.od_settle_case === '선결제' ? BaseStyle.font_blue : BaseStyle.font_pink
                ]}
              >
                {item.od_settle_case}
              </Text>
              <Text style={{ ...BaseStyle.ko12 }}> / </Text>
              <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#999',
                  borderRadius: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 25,
                  height: 25,
                  ...BaseStyle.mr5
                }}
              >
                <Image
                  source={require('../../images/ic_map.png')}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode='center'
                />
              </View>
              <View>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    ...BaseStyle.lh17
                  }}
                >
                  {`${item.od_addr1} ${item.od_addr2}`}
                </Text>
                {item.od_addr3 !== '' && (
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                )}
                {item.od_addr_jibeon !== '' &&
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>}
              </View>
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id)
                deliveryOrderHandler(item.od_type, item.od_id, item.jumju_id, item.jumju_code)
              }}
              style={{
                backgroundColor:
                  item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02,
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
                  // color: item.od_type === "배달" ? "#fff" : "#fff",
                  color: '#fff'
                }}
              >
                {item.od_type === '배달' ? '배달처리' : '포장완료'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
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
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666 }}>
                주문취소
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <OrderRejectCancelModal
        navigation={navigation}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        modalType={modalType}
        od_id={orderId}
        jumjuId={jumjuId}
        jumjuCode={jumjuCode}
      />
      <FlatList
        data={checkOrder}
        renderItem={renderRow}
        keyExtractor={(list, index) => index.toString()}
        // pagingEnabled={true}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        // progressViewOffset={true}
        refreshing={refleshing}
        onRefresh={() => onHandleRefresh()}
        style={{ backgroundColor: '#fff', width: '100%' }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              height: Dimensions.get('window').height - 300
            }}
          >
            <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
              아직 접수된 주문이 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  )
}

export default React.memo(Tab02)