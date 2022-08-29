import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  BackHandler
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Modal from 'react-native-modal'
import Divider from '../../components/Divider'

import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'

const { width, height } = Dimensions.get('window')

const SetCloseDay = props => {
  const { navigation } = props

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(null)
  const [items, setItems] = React.useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ])

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  // 휴무일 지정 모달
  const [isModalVisible, setModalVisible] = React.useState(false)
  const toggleModal = () => {
    setModalVisible(!isModalVisible)
  }

  // 휴무일 삭제 모달
  const [isDelModalVisible, setDelModalVisible] = React.useState(false)
  const toggleDelModal = () => {
    setDelModalVisible(!isDelModalVisible)
  }

  const [noCloseYear, setNoCloseYear] = React.useState(false)
  const noCloseYearToggle = () => {
    setNoCloseYear(prev => !prev)
  }
  const [closeWeekley, setCloseWeekley] = React.useState(false)
  const closeWeeklyToggle = () => {
    setCloseWeekley(prev => !prev)
  }
  const [specialClose, setSpecialClose] = React.useState(false)
  const specialCloseToggle = () => {
    setSpecialClose(prev => !prev)
  }

  const [specialCloseStart, setSpecialCloseStart] = React.useState('')
  const [specialCloseEnd, setSpecialCloseEnd] = React.useState('')

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='휴무일 설정' type='add' toggleModal={toggleModal} />

      {/* 휴무일 삭제 모달 */}
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
            borderRadius: 15
          }}
        >
          <Text style={{ ...BaseStyle.ko14 }}>해당 휴무일을 삭제하시겠습니까?</Text>
          <View style={{ ...BaseStyle.container, ...BaseStyle.mt20 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                toggleDelModal()
                alert('삭제되었습니다.')
              }}
              style={{
                ...BaseStyle.mainBtn,
                width: 90,
                ...BaseStyle.pv10,
                borderRadius: 25,
                ...BaseStyle.mr5
              }}
            >
              <Text style={{ ...BaseStyle.ko14 }}>확인</Text>
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
                borderRadius: 25,
                ...BaseStyle.ml5
              }}
            >
              <Text style={{ ...BaseStyle.ko14 }}>아니오</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* // 휴무일 삭제 모달 */}

      {/* 휴무일 지정 모달 */}
      <Modal
        isVisible={isModalVisible}
        onBackdropPress={toggleModal}
        transparent
        statusBarTranslucent
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
      >
        <View style={{ backgroundColor: '#fff', borderRadius: 15 }}>
          <View
            style={{
              backgroundColor: '#20ABC8',
              borderTopRightRadius: 15,
              borderTopLeftRadius: 15,
              ...BaseStyle.pv30,
              ...BaseStyle.ph20,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative'
            }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>휴무일 추가</Text>
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
              ...BaseStyle.ph20,
              ...BaseStyle.pv20,
              backgroundColor: '#fff',
              borderBottomLeftRadius: 10,
              borderBottomRightRadius: 10
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => noCloseYearToggle()}
              style={{
                ...BaseStyle.container,
                ...BaseStyle.mt20,
                ...BaseStyle.mb10,
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={
                  noCloseYear
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>연중 무휴</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => closeWeeklyToggle()}
              style={{
                ...BaseStyle.container,
                ...BaseStyle.mt20,
                ...BaseStyle.mb10,
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={
                  closeWeekley
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>정기 휴무</Text>
            </TouchableOpacity>
            {closeWeekley ? (
              <>
                <View style={{ zIndex: 100 }}>
                  <DropDownPicker
                    placeholder='매월 둘째'
                    placeholderStyle={{ ...BaseStyle.ko12 }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{
                      borderColor: '#E3E3E3',
                      ...BaseStyle.inputH,
                      ...BaseStyle.round05,
                      ...BaseStyle.mb5
                    }}
                  />
                </View>
                <View style={{ zIndex: 10 }}>
                  <DropDownPicker
                    placeholder='화요일'
                    placeholderStyle={{ ...BaseStyle.ko12 }}
                    open={open}
                    value={value}
                    items={items}
                    setOpen={setOpen}
                    setValue={setValue}
                    setItems={setItems}
                    style={{ borderColor: '#E3E3E3', ...BaseStyle.inputH, ...BaseStyle.round05 }}
                  />
                </View>
              </>
            ) : null}
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => specialCloseToggle()}
              style={{
                ...BaseStyle.container,
                ...BaseStyle.mt20,
                ...BaseStyle.mb10,
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={
                  specialClose
                    ? require('../../images/ic_check_on.png')
                    : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>임시 휴무</Text>
            </TouchableOpacity>
            {specialClose ? (
              <>
                <TextInput
                  value={specialCloseStart}
                  placeholder='시작일 선택'
                  style={{
                    ...BaseStyle.inputH,
                    ...BaseStyle.ph10,
                    ...BaseStyle.border,
                    ...BaseStyle.mb5
                  }}
                  onChangeText={text => setSpecialCloseStart(text)}
                  autoCapitalize='none'
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
                <TextInput
                  value={specialCloseEnd}
                  placeholder='종료일 선택'
                  style={{
                    ...BaseStyle.inputH,
                    ...BaseStyle.ph10,
                    ...BaseStyle.border
                  }}
                  onChangeText={text => setSpecialCloseEnd(text)}
                  autoCapitalize='none'
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
              </>
            ) : null}
          </View>
          <TouchableOpacity
            style={{
              borderRadius: 25,
              borderWidth: 1,
              borderColor: '#E3E3E3',
              justifyContent: 'center',
              alignItems: 'center',
              width: 100,
              alignSelf: 'center',
              ...BaseStyle.pv10,
              ...BaseStyle.mb30
            }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_666 }}>거부완료</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      {/* // 휴무일 지정 모달 */}

      <View style={{ ...BaseStyle.ph20 }}>
        <Divider backgroundColor='#E3E3E3' />
        <View style={{ ...BaseStyle.mb15 }} />

        {/* 정기 휴무 */}
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleDelModal}
          style={{
            ...BaseStyle.container5,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            borderRadius: 5,
            ...BaseStyle.ph20,
            ...BaseStyle.pv20,
            ...BaseStyle.mv5
          }}
        >
          <View>
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_999, ...BaseStyle.mb5 }}>
              정기 휴무
            </Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>매월 둘째 월요일</Text>
          </View>
          <View>
            <Image
              source={require('../../images/ic_del.png')}
              style={{ width: 20, height: 20 }}
              resizeMode='cover'
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleDelModal}
          style={{
            ...BaseStyle.container5,
            borderWidth: 1,
            borderColor: '#E3E3E3',
            borderRadius: 5,
            ...BaseStyle.ph20,
            ...BaseStyle.pv20,
            ...BaseStyle.mv5
          }}
        >
          <View>
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_999, ...BaseStyle.mb5 }}>
              정기 휴무
            </Text>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>매월 둘째 월요일</Text>
          </View>
          <View>
            <Image
              source={require('../../images/ic_del.png')}
              style={{ width: 20, height: 20 }}
              resizeMode='cover'
            />
          </View>
        </TouchableOpacity>
        {/* // 정기 휴무 */}
      </View>
    </View>
  )
}

export default SetCloseDay
