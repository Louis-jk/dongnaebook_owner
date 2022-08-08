import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
  BackHandler
} from 'react-native'
import Modal from 'react-native-modal'
import { useSelector } from 'react-redux'
import Swipeout from 'react-native-swipeout-mod' // 스와이프 기능(수정, 삭제)
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import TipsModal from '../components/TipsModal'
import TipsEditModal from '../components/TipsEditModal'
import Api from '../Api'
import cusToast from '../components/CusToast'
import AnimateLoading from '../components/AnimateLoading'

const { width, height } = Dimensions.get('window')

const SetTips = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const [isLoading, setLoading] = React.useState(false)
  const [list, setList] = React.useState([]) // 팁 리스트
  const [tipId, setTipId] = React.useState('') // 팁 ID

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  // 팁 모달
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  // 삭제 모달
  const [isDelModalVisible, setDelModalVisible] = React.useState(false)
  const toggleDelModal = () => {
    setDelModalVisible(!isDelModalVisible)
  }

  // 금액 추가 모달 핸들러
  const [modalType, setModalType] = React.useState('')
  const toggleModalHandler = payload => {
    setModalType(payload)
    toggleModal()
  }

  // 사용 체크
  const [use, setUse] = React.useState(false)
  const useToggle = () => {
    setUse(prev => !prev)
  }

  const getTips = () => {
    setLoading(true)

    const param = {
      jumju_id: mtId,
      jumju_code: mtJumjuCode
    }

    Api.send('store_delivery', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        setList(arrItems)
      } else {
        setList(arrItems)
      }
      setLoading(false)
    })
  }

  React.useEffect(() => {
    const init = getTips()
    return () => init
  }, [])

  const tipDelHandler = () => {
    // let toIntId = parseInt(tipId);
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'delete',
      dd_id: tipId
    }

    Api.send('store_delivery_input', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        toggleDelModal()
        getTips()
        cusToast('해당 배달팁이 삭제되었습니다.')
      } else {
        cusToast('해당 배달팁을 삭제할 수 없습니다.')
      }
    })
  }

  const [isEditModal, setEditModal] = React.useState(false)
  const [editPrice, setEditPrice] = React.useState({})
  const editTipsModalHandler = () => {
    setEditModal(!isEditModal)
  }

  const renderRow = ({ item, index }) => {
    const swipeBtns = [
      {
        text: '수정',
        component: (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../images/edit.png')}
              style={{ width: 20, height: 20, marginBottom: 10 }}
              resizeMode='center'
            />
            <Text style={{ ...BaseStyle.ko14 }}>수정</Text>
          </View>
        ),
        color: '#222',
        backgroundColor: Primary.PointColor03,
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          setEditPrice({
            index: index,
            dd_id: item.dd_id,
            minPrice: item.dd_charge_start,
            maxPrice: item.dd_charge_end,
            deliveryPrice: item.dd_charge_price
          })
          editTipsModalHandler()
        }
      },
      {
        text: '삭제',
        component: (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../images/delete_wh.png')}
              style={{ width: 20, height: 20, marginBottom: 10 }}
              resizeMode='center'
            />
            <Text style={{ ...BaseStyle.ko14, color: '#fff' }}>삭제</Text>
          </View>
        ),
        color: '#fff',
        backgroundColor: Primary.PointColor02,
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => {
          setTipId(item.dd_id)
          toggleDelModal()
        }
      }
    ]

    return (
      <Swipeout
        right={swipeBtns}
        autoClose
        backgroundColor='transparent'
        style={{ height: 190, ...BaseStyle.mv10 }}
      >
        <View
          activeOpacity={1}
          style={{
            ...BaseStyle.mh20,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            borderRadius: 5
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: Primary.PointColor01,
              ...BaseStyle.ph15,
              ...BaseStyle.pv10
            }}
          >
            <View>
              <Text style={{ ...BaseStyle.font_white }}>배달팁{index + 1}</Text>
            </View>
            <Image
              source={require('../images/logo.png')}
              style={{ width: 80, height: 20 }}
              resizeMode='contain'
            />
          </View>
          <View
            style={{
              ...BaseStyle.container7,
              ...BaseStyle.mb10,
              ...BaseStyle.ph20,
              ...BaseStyle.pv10
            }}
          >
            <View style={{ flex: 1 }}>
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
                      ...BaseStyle.ph10,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>
                      {item.dd_charge_start}
                    </Text>
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
                      ...BaseStyle.ph10,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>
                      {item.dd_charge_end}
                    </Text>
                    <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>원</Text>
                  </View>
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.ml10 }}>미만</Text>
                </View>
              </View>
              <View style={{ width: '70%', ...BaseStyle.container, ...BaseStyle.mr35 }}>
                <Text style={{ ...BaseStyle.ko14 }}>위 금액일 경우, </Text>
                <View style={{ marginLeft: 23, width: '79%', ...BaseStyle.container }}>
                  {/* ...BaseStyle.ml65 */}
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mh10 }}>배달비</Text>
                  <View
                    style={{
                      ...BaseStyle.container,
                      flex: 1,
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.inputH,
                      ...BaseStyle.ph10,
                      justifyContent: 'flex-end'
                    }}
                  >
                    <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>
                      {item.dd_charge_price}
                    </Text>
                    <Text style={{ ...BaseStyle.ko14, textAlign: 'right' }}>원</Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
      </Swipeout>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='배달팁 설정' toggleModal={toggleModal} />
      {/* // 추가 모달 */}
      <TipsModal
        navigation={navigation}
        modalType={modalType}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        getTips={getTips}
      />
      {/* // 추가 모달 */}
      {/* 수정 모달 */}
      <TipsEditModal
        navigation={navigation}
        isModalVisible={isEditModal}
        toggleModal={editTipsModalHandler}
        index={editPrice.index}
        dd_id={editPrice.dd_id}
        min={editPrice.minPrice}
        max={editPrice.maxPrice}
        delivery={editPrice.deliveryPrice}
        getTips={getTips}
      />
      {/* // 수정 모달 */}

      {/* 삭제 모달 */}
      <Modal
        isVisible={isDelModalVisible}
        onBackdropPress={toggleDelModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
      >
        <View
          style={{
            backgroundColor: '#fff',
            ...BaseStyle.pv30,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            position: 'relative'
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={toggleDelModal}
            style={{
              position: 'absolute',
              top: -10,
              right: -10,
              backgroundColor: Primary.PointColor01,
              borderRadius: 30,
              width: 30,
              height: 30,
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <Image
              source={require('../images/close.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'center'
              }}
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko14 }}>해당 배달팁을 삭제하시겠습니까?</Text>
          <View style={{ ...BaseStyle.container, ...BaseStyle.mt20 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => tipDelHandler()}
              style={{
                ...BaseStyle.mainBtn,
                width: 90,
                ...BaseStyle.pv10,
                borderRadius: 5,
                ...BaseStyle.mr5
              }}
            >
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>확인</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleDelModal}
              style={{
                borderWidth: 1,
                borderColor: '#E3E3E3',
                width: 90,
                ...BaseStyle.pv10,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                ...BaseStyle.ml5
              }}
            >
              <Text style={{ ...BaseStyle.ko14 }}>아니오</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* // 삭제 모달 */}

      <View style={{ ...BaseStyle.ph20 }}>
        {/* 배달팁 */}
        <View style={{ ...BaseStyle.mv15 }}>
          <View style={{ ...BaseStyle.container5, ...BaseStyle.mb5 }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>배달팁</Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => toggleModalHandler('minPrice')}
              style={{
                ...BaseStyle.mainBtn,
                width: '20%',
                justifyContent: 'center',
                alignContent: 'center',
                ...BaseStyle.pv7
              }}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
            >
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.textWhite }}>추가</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* // 배달팁 */}
        {/* 배달팁 안내 */}
        {list && list.length > 0 && (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-start',
              alignItems: 'center',
              ...BaseStyle.mb5
            }}
          >
            <View style={{ flexDirection: 'row', width: '80%' }}>
              <Text
                style={{
                  ...BaseStyle.ko12,
                  ...BaseStyle.lh17,
                  color: Primary.PointColor02
                }}
              >
                {'※ '}
              </Text>
              <Text
                style={{
                  ...BaseStyle.ko12,
                  ...BaseStyle.lh17,
                  color: Primary.PointColor02
                }}
              >
                {
                  '배달팁을 편집 또는 삭제하시려면\n해당 배달팁을 오른쪽에서 왼쪽으로 스와이프해주세요.'
                }
              </Text>
            </View>
            <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={require('../images/swipe_m.png')}
                style={{ width: 100, height: 25 }}
                resizeMode='contain'
              />
            </View>
          </View>
        )}
        {/* // 배달팁 안내 */}
      </View>

      {/* 리스트 */}
      {isLoading ? (
        <AnimateLoading description='잠시만 기다려주세요.' />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <FlatList
            data={list}
            renderItem={renderRow}
            keyExtractor={(list, index) => index.toString()}
            // pagingEnabled={true}
            persistentScrollbar
            showsVerticalScrollIndicator={false}
            // progressViewOffset={true}
            // refreshing={true}
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
                  아직 설정하신 배달팁이 없습니다.
                </Text>
              </View>
            }
          />
        </View>
      )}
      {/* // 리스트 */}

      {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => toggleModalHandler('minPrice')}
        style={{...BaseStyle.mainBtn}}
      >
        <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold}}>배달팁 추가</Text>
      </TouchableOpacity> */}
    </View>
  )
}

export default SetTips
