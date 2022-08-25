import * as React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Modal from 'react-native-modal'

import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'

const { width, height } = Dimensions.get('window')

const SetRestTime = props => {
  const { navigation } = props

  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(null)
  const [items, setItems] = React.useState([
    { label: 'Apple', value: 'apple' },
    { label: 'Banana', value: 'banana' }
  ])

  // 휴게시간 월~일 요일
  const [dayOpen, setDayOpen] = React.useState(false)
  const [dayValue, setDayValue] = React.useState(null)
  const [dayItems, setDayItems] = React.useState([
    { label: '월요일', value: 'mon' },
    { label: '화요일', value: 'tue' },
    { label: '수요일', value: 'wed' },
    { label: '목요일', value: 'thu' },
    { label: '금요일', value: 'fri' },
    { label: '토요일', value: 'sat' },
    { label: '일요일', value: 'sun' }
  ])

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

  // 사용 체크
  const [use, setUse] = React.useState(false)
  const useToggle = () => {
    setUse(prev => !prev)
  }
  const [specialClose, setSpecialClose] = React.useState(false)
  const specialCloseToggle = () => {
    setSpecialClose(prev => !prev)
  }

  const [specialCloseStart, setSpecialCloseStart] = React.useState('')
  const [specialCloseEnd, setSpecialCloseEnd] = React.useState('')

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='휴게시간 설정' type='add' toggleModal={toggleModal} />

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
          <Text style={{ ...BaseStyle.ko14 }}>해당 휴게시간을 삭제하시겠습니까?</Text>
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
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold }}>휴게시간 추가</Text>
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
              onPress={() => useToggle()}
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
                  use ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>사용</Text>
            </TouchableOpacity>

            <View style={{ zIndex: 100 }}>
              <DropDownPicker
                placeholder='월요일'
                placeholderStyle={{ ...BaseStyle.ko12 }}
                open={dayOpen}
                value={dayValue}
                items={dayItems}
                setOpen={setDayOpen}
                setValue={setDayValue}
                setItems={setDayItems}
                style={{
                  borderColor: '#E3E3E3',
                  ...BaseStyle.inputH,
                  ...BaseStyle.round05,
                  ...BaseStyle.mb5
                }}
                // maxHeight={300}
              />
            </View>
            <View style={{ zIndex: -1 }}>
              <TextInput
                value={specialCloseStart}
                placeholder='시작 시간 선택'
                style={{
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.border,
                  ...BaseStyle.mb5,
                  zIndex: -1
                }}
                onChangeText={text => setSpecialCloseStart(text)}
                autoCapitalize='none'
                // onSubmitEditing={() => userPwdReRef.current.focus()}
              />
              <TextInput
                value={specialCloseEnd}
                placeholder='종료 시간 선택'
                style={{
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                  ...BaseStyle.border,
                  zIndex: -1
                }}
                onChangeText={text => setSpecialCloseEnd(text)}
                autoCapitalize='none'
                // onSubmitEditing={() => userPwdReRef.current.focus()}
              />
            </View>
          </View>
          <View style={{ zIndex: -1 }}>
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
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_666 }}>등록완료</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* // 휴무일 지정 모달 */}

      <View style={{ ...BaseStyle.ph20 }}>
        {/* <View style={{height: 1, width: '100%', backgroundColor: '#E3E3E3', ...BaseStyle.mb15}} /> */}
        <View style={{ ...BaseStyle.mb15 }} />

        {/* 휴게시간 추가 리스트 */}
        <View
          activeOpacity={1}
          style={{
            borderWidth: 1,
            borderColor: '#E3E3E3',
            borderRadius: 5,
            ...BaseStyle.ph15,
            ...BaseStyle.pv15,
            ...BaseStyle.mb15
          }}
        >
          <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => useToggle()}
              style={{
                ...BaseStyle.container,
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={
                  use ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>사용</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleDelModal}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={require('../../images/ic_del.png')}
                style={{ width: 20, height: 20 }}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
              월요일
            </Text>
            <View style={{ ...BaseStyle.container }}>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph5
                }}
              >
                <TextInput
                  placeholder='시간 선택'
                  onChangeText={text => setUserPwd(text)}
                  autoCapitalize='none'
                  returnKeyLabel='다음'
                  returnKeyType='next'
                  secureTextEntry
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
              </View>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mh10 }}>부터</Text>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph5,
                  ...BaseStyle.mr10
                }}
              >
                <TextInput
                  placeholder='시간 선택'
                  onChangeText={text => setUserPwd(text)}
                  autoCapitalize='none'
                  returnKeyLabel='다음'
                  returnKeyType='next'
                  secureTextEntry
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
              </View>
              <Text style={{ ...BaseStyle.ko14 }}>까지</Text>
            </View>
          </View>
        </View>
        {/* // 휴게시간 추가 리스트 */}

        {/* 휴게시간 추가 리스트 */}
        <View
          activeOpacity={1}
          style={{
            borderWidth: 1,
            borderColor: '#E3E3E3',
            borderRadius: 5,
            ...BaseStyle.ph15,
            ...BaseStyle.pv15,
            ...BaseStyle.mb15
          }}
        >
          <View style={{ ...BaseStyle.container5, ...BaseStyle.mb10 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => useToggle()}
              style={{
                ...BaseStyle.container,
                justifyContent: 'flex-start',
                alignItems: 'center',
                alignSelf: 'flex-start'
              }}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={
                  use ? require('../../images/ic_check_on.png') : require('../../images/ic_check_off.png')
                }
                style={{ width: 20, height: 20, ...BaseStyle.mr10 }}
                resizeMode='cover'
              />
              <Text style={{ ...BaseStyle.ko14 }}>사용</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleDelModal}
              hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
            >
              <Image
                source={require('../../images/ic_del.png')}
                style={{ width: 20, height: 20 }}
                resizeMode='cover'
              />
            </TouchableOpacity>
          </View>
          <View>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
              월요일
            </Text>
            <View style={{ ...BaseStyle.container }}>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph5
                }}
              >
                <TextInput
                  placeholder='시간 선택'
                  onChangeText={text => setUserPwd(text)}
                  autoCapitalize='none'
                  returnKeyLabel='다음'
                  returnKeyType='next'
                  secureTextEntry
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
              </View>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mh10 }}>부터</Text>
              <View
                style={{
                  width: '30%',
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph5,
                  ...BaseStyle.mr10
                }}
              >
                <TextInput
                  placeholder='시간 선택'
                  onChangeText={text => setUserPwd(text)}
                  autoCapitalize='none'
                  returnKeyLabel='다음'
                  returnKeyType='next'
                  secureTextEntry
                  // onSubmitEditing={() => userPwdReRef.current.focus()}
                />
              </View>
              <Text style={{ ...BaseStyle.ko14 }}>까지</Text>
            </View>
          </View>
        </View>
        {/* // 휴게시간 추가 리스트 */}
      </View>
    </View>
  )
}

export default SetRestTime
