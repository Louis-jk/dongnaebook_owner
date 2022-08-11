import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import 'moment/locale/ko'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import OrderCheckModal from '../OrderCheckModal'
import OrderRejectCancelModal from '../OrderRejectCancelModal'
import AnimateLoading from '../AnimateLoading'
import OrderEmpty from './OrderEmpty'

const Tab01 = props => {
  const { navigation } = props
  const { newOrder, newOrderRefleshing } = useSelector(state => state.order) // 신규 주문 건
  const [isLoading, setLoading] = React.useState(false)
  const [orderId, setOrderId] = React.useState('') // 주문 ID
  const [orderType, setOrderType] = React.useState('') // 주문 Type
  const [refleshing, setReflashing] = React.useState(false)
  const [jumjuId, setJumjuId] = React.useState('') // 해당 점주 아이디
  const [jumjuCode, setJumjuCode] = React.useState('') // 해당 점주 코드
  const [count, setCount] = React.useState(0)

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false)
  const [modalType, setModalType] = React.useState('')
  const toggleModal = payload => {
    setModalType(payload)
    setModalVisible(!isModalVisible)
  }

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)
  const toggleOrderCheckModal = () => {
    setOrderCheckModalVisible(!isOrderCheckModalVisible)
  }

  React.useEffect(() => {
    console.log('newOrderRefleshing', newOrderRefleshing)
    setLoading(newOrderRefleshing)
  }, [newOrderRefleshing])

  function handleLoadMore () {
    setCount(prev => prev + 1)
  }

  const onHandleRefresh = () => {
    setReflashing(true)
  }

  const renderRow = ({ item, index }) => {
    return (
      <View key={index}>
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
                type: 'ready',
                jumjuId: item.jumju_id,
                jumjuCode: item.jumju_code
              })}
          >
            <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }} numberOfLines={1}>
                {item.mb_company}
              </Text>
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
                setOrderType(item.od_type)
                setJumjuId(item.jumju_id)
                setJumjuCode(item.jumju_code)
                toggleOrderCheckModal()
              }}
              style={{
                backgroundColor: Primary.PointColor02,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                ...BaseStyle.round05,
                ...BaseStyle.pv10,
                ...BaseStyle.mb5
              }}
            >
              <Text
                style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white }}
              >
                접수
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id)
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
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666 }}>
                주문거부
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          {newOrder && newOrder.length > 0 && (
            <OrderCheckModal
              isModalVisible={isOrderCheckModalVisible}
              toggleModal={toggleOrderCheckModal}
              oderId={orderId}
              orderType={orderType}
              navigation={navigation}
              jumjuId={jumjuId}
              jumjuCode={jumjuCode}
            />
          )}
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
            data={newOrder}
            renderItem={renderRow}
            keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
            persistentScrollbar
            showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
            refreshing={refleshing}
            onRefresh={() => onHandleRefresh()}
          // onEndReached={handleLoadMore}
          // onEndReachedThreshold={0.01}
            style={{ backgroundColor: '#fff', width: '100%' }}
            ListEmptyComponent={
              <OrderEmpty text='신규' />
          }
          />
        </View>}
    </>
  )
}

export default React.memo(Tab01)
