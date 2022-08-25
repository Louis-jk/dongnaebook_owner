import React from 'react'
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Keyboard
} from 'react-native'
import Api from '../../Api'
import cusToast from '../../components/CusToast'
import Header from '../../components/Headers/NoDrawerHeader'
import BaseStyle, { Primary } from '../../styles/Base'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen')

const SetNewPwd = props => {
  const { navigation } = props
  const { mt_id: mtId } = props.route.params

  const [userId, setUserId] = React.useState('')
  const [userMobile, setUserMobile] = React.useState('') // 휴대폰 번호
  const [userInsertConfirmNumber, setUserInsertConfirmNumber] = React.useState('') // 인증번호
  const [confirmNumber, setConfirmNumber] = React.useState(0) // 인증번호
  const [isSendConfirmNumber, setSendConfirmNumber] = React.useState(false) // 인증번호 발송 유무
  const [isConfirmed, setConfirmed] = React.useState(false) // 인증번호 발송 유무

  const [newPwd, setNewPwd] = React.useState('') // 새 비밀번호
  const [newPwdRe, setNewPwdRe] = React.useState('') // 새 비밀번호 확인

  const [isNewPwdEmpty, setNewPwdEmpty] = React.useState(false) // 새 비밀번호 공백
  const [isNewPwdRegError, setNewPwdRegError] = React.useState(false) // 새 비밀번호 유효성

  const [isNewPwdReEmpty, setNewPwdReEmpty] = React.useState(false) // 새 비밀번호 확인란 공백
  const [isNewPwdReRegError, setNewPwdReRegError] = React.useState(false) // 새 비밀번호 확인란 유효성
  const [isNewPwdReNotEqualNewPwd, setNewPwdReNotEqualNewPwd] = React.useState(false) // 새 비밀번호 확인란 공백

  const newPwdReRef = React.useRef(null)

  console.log('props?', props)
  console.log('mt_id?', mtId)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  // 새 비밀번호 체크
  const checkNewPasswordHandler = () => {
    if (!newPwd) {
      setNewPwdEmpty(true)
      setNewPwdRegError(false)
    } else if (newPwd.length < 4) {
      setNewPwdRegError(true)
    }
  }

  // 새 비밀번호 확인 체크
  const checkNewPasswordReHandler = () => {
    if (!newPwdRe) {
      setNewPwdReEmpty(true)
    } else if (newPwdRe.length < 4) {
      setNewPwdReRegError(true)
    }
  }

  // 비밀번호 변경 submit
  const onChangePwd = () => {
    Keyboard.dismiss()

    if (newPwdRe !== newPwd) {
      setNewPwdReNotEqualNewPwd(true)
      newPwdReRef.current.focus()
    } else {
      const param = {
        encodeJson: true,
        mt_id: mtId,
        mt_pwd: newPwd,
        mt_pwd_re: newPwdRe
      }

      Api.send('member_update_pwd', param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        console.log('member_update_pwd resultItem', resultItem)
        console.log('member_update_pwd arrItems', arrItems)

        if (resultItem.result === 'Y') {
          cusToast('비밀번호를 수정하였습니다.\n로그인화면으로 이동합니다.', 1000)

          setTimeout(() => {
            navigation.navigate('Login')
          }, 3000)
        } else {
          cusToast('비밀번호를 수정하지 못하였습니다.\n관리자에게 문의해주세요.', 1000)
        }
      })
    }
  }

  // 휴대전화 인증
  const confirmPhoneNumber = () => {
    const param = {
      encodeJson: true,
      mt_level: 5,
      mt_hp: userMobile
    }

    Api.send('store_sms_send', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      console.log('phone confime', resultItem)
      console.log('phone arrItems', arrItems)

      if (resultItem.result === 'Y') {
        setConfirmNumber(arrItems.certno)
        setSendConfirmNumber(true)
      }
    })
  }

  const confirmNumberCheck = () => {
    if (userInsertConfirmNumber === confirmNumber.toString()) {
      console.log('같습니다. 확인 되었습니다.')
      setConfirmed(true)
      Keyboard.dismiss()
    } else {
      console.log('틀립니다. 다시 입력해주세요.')
      setConfirmed(false)
    }
  }

  console.log('confirmNumber ??', confirmNumber)
  console.log('userInsertConfirmNumber ??', userInsertConfirmNumber)
  console.log('isConfirmed ??', isConfirmed)

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='비밀번호 변경' />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          ...BaseStyle.ph20,
          ...BaseStyle.mt50
        }}
      >
        <Text style={{ ...BaseStyle.ko20, ...BaseStyle.font_bold, ...BaseStyle.mb30 }}>
          새로운 비밀번호를 입력해주세요.
        </Text>

        <View style={{ ...BaseStyle.mb30, width: SCREEN_WIDTH - 40 }}>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb10 }}>비밀번호 변경</Text>
          <View style={{ ...BaseStyle.container5, ...BackHandler.inputH }}>
            <TextInput
              value={newPwd}
              placeholder='변경하실 비밀번호를 입력해주세요.'
              style={{ ...BaseStyle.border, ...BaseStyle.ph10, width: '100%' }}
              autoCapitalize='none'
              keyboardType='default'
              secureTextEntry
              onChangeText={text => {
                setNewPwdEmpty(false)
                setNewPwdRegError(false)
                setNewPwd(text)
              }}
              onBlur={checkNewPasswordHandler}
            />
          </View>
          {isNewPwdEmpty && (
            <Text
              style={{
                ...BaseStyle.ko12,
                color: Primary.PointColor02,
                ...BaseStyle.mt5,
                ...BaseStyle.mb10
              }}
            >
              ※ 비밀번호를 입력해주세요.
            </Text>
          )}
          {isNewPwdRegError && (
            <Text
              style={{
                ...BaseStyle.ko12,
                color: Primary.PointColor02,
                ...BaseStyle.mt5,
                ...BaseStyle.mb10
              }}
            >
              ※ 비밀번호를 4자리 이상 입력해주세요.
            </Text>
          )}

          <View style={{ ...BaseStyle.container5, ...BackHandler.inputH, ...BaseStyle.mt10 }}>
            <TextInput
              ref={newPwdReRef}
              value={newPwdRe}
              placeholder='변경하실 비밀번호를 재입력해주세요.'
              style={{ ...BaseStyle.border, ...BaseStyle.ph10, width: '100%' }}
              autoCapitalize='none'
              keyboardType='default'
              secureTextEntry
              onChangeText={text => {
                setNewPwdReEmpty(false)
                setNewPwdReRegError(false)
                setNewPwdReNotEqualNewPwd(false)
                setNewPwdRe(text)
              }}
              onBlur={checkNewPasswordReHandler}
            />
          </View>
          {isNewPwdReEmpty && (
            <Text
              style={{
                ...BaseStyle.ko12,
                color: Primary.PointColor02,
                ...BaseStyle.mt5,
                ...BaseStyle.mb10
              }}
            >
              ※ 비밀번호를 재입력해주세요.
            </Text>
          )}
          {isNewPwdReRegError && (
            <Text
              style={{
                ...BaseStyle.ko12,
                color: Primary.PointColor02,
                ...BaseStyle.mt5,
                ...BaseStyle.mb10
              }}
            >
              ※ 비밀번호를 4자리 이상 입력해주세요.
            </Text>
          )}
          {isNewPwdReNotEqualNewPwd && (
            <Text
              style={{
                ...BaseStyle.ko12,
                color: Primary.PointColor02,
                ...BaseStyle.mt5,
                ...BaseStyle.mb10
              }}
            >
              ※ 변경하실 비밀번호가 일치하지 않습니다.
            </Text>
          )}
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            if (!isNewPwdEmpty && newPwd.length > 3 && !isNewPwdRegError && !isNewPwdReEmpty) {
              onChangePwd()
            }
          }}
          style={{
            ...BaseStyle.container0,
            ...BaseStyle.inputH,
            borderWidth: 1,
            borderColor:
              !isNewPwdEmpty &&
              newPwd.length > 3 &&
              !isNewPwdRegError &&
              !isNewPwdReEmpty &&
              newPwdRe.length > 3 &&
              !isNewPwdReRegError
                ? Primary.PointColor01
                : Primary.PointColor03,
            borderRadius: 5,
            width: '100%',
            backgroundColor:
              !isNewPwdEmpty &&
              newPwd.length > 3 &&
              !isNewPwdRegError &&
              !isNewPwdReEmpty &&
              newPwdRe.length > 3 &&
              !isNewPwdReRegError
                ? Primary.PointColor01
                : Primary.PointColor03
          }}
        >
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_white }}>변경하기</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default SetNewPwd
