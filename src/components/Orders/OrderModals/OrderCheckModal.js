import * as React from 'react'
import { View, Text, TouchableOpacity, TextInput, Image } from 'react-native'
import Modal from 'react-native-modal'
import { useSelector, useDispatch } from 'react-redux'
import BaseStyle, { Primary } from '../../../styles/Base'
import Api from '../../../Api'
import * as orderAction from '../../../redux/actions/orderAction'
import cusToast from '../../CusToast'

const deliveryTimes = ['20', '30', '40', '50', '60', '70']
const takeoutTimes = ['5', '10', '15', '20', '25', '30']

const OrderCheckModal = ({
  isModalVisible,
  toggleModal,
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
      od_process_status: '접수완료'
    }

    if (orderType === '배달') {
      param.delivery_time = isTimeSelected ? time01Selcet : time01
    }

    if (orderType === '포장') {
      param.visit_time = isTimeSelected ? time02Selcet : time02
    }

    if (orderType === '식사') {
      param.visit_time = isTimeSelected ? time03Selcet : time03
    }

    // proc_store_order_status_update
    Api.send('store_order_status_update', param, args => {
      const resultItem = args.resultItem
      // const arrItems = args.arrItems

      if (resultItem.result === 'Y') {        
        cusToast('주문을 접수하였습니다.')
      } else {
        cusToast('주문 접수중 오류가 발생하였습니다.\n다시 한번 시도해주세요.')
      }

      getOrderListHandler()
      toggleModal()

      setTimeout(() => {
        navigation.navigate('Home', { screen: 'Main' })
      }, 1500)
    })
  }

  const checkingDeliveryTimeHandler = () => {
    const checkTime = deliveryTimes.includes(time01)
    if (checkTime) {
      setTime01Select(time01)
      setTime01('')
    }
    console.log('checkTime', checkTime)
  }

  const checkingTakeoutTimeHandler = () => {
    const checkTime = takeoutTimes.includes(time02)
    if (checkTime) {
      setTime02Select(time02)
      setTime02('')
    }
    console.log('checkTime', checkTime)
  }

  // React.useEffect(() => {
  //   checkingDeliveryTimeHandler()

  //   return () => checkingDeliveryTimeHandler()
  // }, [time01])

  // React.useEffect(() => {
  //   checkingTakeoutTimeHandler()

  //   return () => checkingTakeoutTimeHandler()
  // }, [time02])

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
              backgroundColor: orderType === '배달' ? Primary.PointColor01 : orderType === '포장' ? Primary.PointColor02 : Primary.PointColor04,
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
            {orderType === '배달'
              ? '배달출발 예상시간을 입력해주세요.'
              : orderType === '포장'
              ? '포장완료 예상시간을 입력해주세요.'
              : '식사가능 예상시간을 입력해주세요.'}
          </Text>

          {/* 시간 선택 영역 */}
          <View style={{ ...BaseStyle.container0, flexWrap: 'wrap', paddingHorizontal: 25 }}>
            {orderType === '배달' && deliveryTimes.map((time, index) => (
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
                    backgroundColor: time01Selcet === time ? Primary.PointColor01 : Primary.PointColor03,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: time01Selcet === time ? '#fff' : '#222' }}>{time}분</Text>
                </TouchableOpacity>
              </View>
            ))}

            {orderType === '포장' && takeoutTimes.map((time, index) => (
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
                    backgroundColor: time02Selcet === time ? Primary.PointColor02 : Primary.PointColor03,
                    borderRadius: 5
                  }}
                >
                  <Text style={{ color: time02Selcet === time ? '#fff' : '#222' }}>{time}분</Text>
                </TouchableOpacity>
              </View>
            ))}

            {orderType === '식사' && takeoutTimes.map((time, index) => (
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
                    backgroundColor: time03Selcet === time ? Primary.PointColor04 : Primary.PointColor03,
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
                value={orderType === '배달' ? time01 : orderType === '포장' ? time02 : time03}
                style={{ width: '83%', textAlign: 'right' }}
                placeholder='직접입력 예: 30'
                onChangeText={text => {
                  const filteredText = text.replace(/(-)|(\.)/gi, '')
                  if (filteredText !== null || filteredText !== '') {
                    if (orderType === '배달') {
                      setTime01Select('')
                      setTime01(filteredText)
                    } else if (orderType === '포장') {
                      setTime02Select('')
                      setTime02(filteredText)
                    } else {
                      setTime03Select('')
                      setTime03(filteredText)
                    }
                    setTimeSelected(false)
                  } else {
                    if (orderType === '배달') {
                      setTime01('0')
                    } else if (orderType === '포장') {
                      setTime02('0')
                    }else {
                      setTime03('0')
                    }
                  }
                }}
                // onBlur={() => {
                //   if (orderType === '배달') {
                //     checkingDeliveryTimeHandler()
                //   } else {
                //     checkingTakeoutTimeHandler()
                //   }
                // }}
                autoCapitalize='none'
                keyboardType='number-pad'
              />
              <Text>분 {orderType === '배달' ? '후' : '후'}</Text>
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
                borderRadius: 5,
                backgroundColor: orderType === '배달' ? Primary.PointColor01 : orderType === '포장' ? Primary.PointColor02 : Primary.PointColor04
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
