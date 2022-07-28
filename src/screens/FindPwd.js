import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Keyboard,
} from 'react-native';
import Api from '../Api';
import CountDown from '../components/CountDown';
import cusToast from '../components/CusToast';
import Header from '../components/NoDrawerHeader';
import BaseStyle, { Primary } from '../styles/Base';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('screen');

const FindPwd = props => {
  const { navigation } = props;
  const [userMobile, setUserMobile] = React.useState(''); // 휴대폰 번호
  const [userInsertConfirmNumber, setUserInsertConfirmNumber] = React.useState(''); // 인증번호
  const [confirmNumber, setConfirmNumber] = React.useState(0); // 인증번호
  const [userId, setUserId] = React.useState(''); // 유저 ID
  const [isSendConfirmNumber, setSendConfirmNumber] = React.useState(false); // 인증번호 발송 유무
  const [isConfirmed, setConfirmed] = React.useState(false); // 인증번호 발송 유무

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  // 인증시 카운터
  const [minutes, setMinutes] = React.useState(0);
  const [seconds, setSeconds] = React.useState(0);
  const [isCounter, setIsCounter] = React.useState(false);
  const confirmCount = num => {
    setIsCounter(true);
    setMinutes(num);
    // setSeconds(num);
  };

  const confirmClearCount = num => {
    setIsCounter(false);
    setMinutes(num);
    // setSeconds(num);
  };

  // 본인 인증 시간 초과의 경우 상태관리
  const [isSend, setIsSend] = React.useState(false);
  const [reSend, setReSend] = React.useState(false);
  const [reSendStatus, setReSendStatus] = React.useState('n');
  const [timeOver, setTimeOver] = React.useState(false);
  const onFailConfirm = () => {
    setIsSend(false);
    setReSend(true);
    setReSendStatus('y');
  };

  // 휴대전화 인증
  const confirmPhoneNumber = () => {
    const reg = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    if (reg.test(userMobile)) {
      setIsSend(true);
      confirmCount(3);

      const param = {
        encodeJson: true,
        mt_level: 5,
        mt_hp: userMobile,
      };

      Api.send('store_sms_send', param, args => {
        const resultItem = args.resultItem;
        const arrItems = args.arrItems;

        console.log('phone confime', resultItem);
        console.log('phone arrItems', arrItems);
        Keyboard.dismiss();

        if (resultItem.result === 'Y') {
          setConfirmNumber(arrItems.certno);
          setUserId(arrItems.mt_id);
          setSendConfirmNumber(true);
          cusToast('인증번호가 발송되었습니다.', 2000);
        } else {
          setConfirmNumber(0);
          setUserId('');
          setSendConfirmNumber(false);
          cusToast('인증번호가 발송되지 못했습니다.', 2000);
        }
      });
    } else {
      Keyboard.dismiss();
      cusToast('올바른 휴대전화번호를 입력해주세요.', 2000);
    }
  };

  const confirmNumberCheck = () => {
    Keyboard.dismiss();
    if (userInsertConfirmNumber === confirmNumber.toString()) {
      confirmCount(0);
      setIsCounter(false);
      cusToast('인증번호가 확인되었습니다.\n비밀번호를 변경해주세요.', 2000);
      setConfirmed(true);
      Keyboard.dismiss();
    } else {
      cusToast('인증번호가 일치하지 않습니다.\n다시 확인해주세요.', 2000);
      setConfirmed(false);
    }
  };

  console.log('confirmNumber ??', confirmNumber);
  console.log('userInsertConfirmNumber ??', userInsertConfirmNumber);
  console.log('isConfirmed ??', isConfirmed);

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title="비밀번호 찾기" />
      <View
        style={{
          flex: 1,
          justifyContent: 'flex-start',
          alignItems: 'center',
          ...BaseStyle.ph20,
          ...BaseStyle.mt50,
        }}>
        <Text style={{ ...BaseStyle.ko20, ...BaseStyle.font_bold, ...BaseStyle.mb30 }}>
          비밀번호를 잊으셨나요?
        </Text>
        {/* <View style={{...BaseStyle.mb20, width: SCREEN_WIDTH - 40}}>
          <Text style={{...BaseStyle.ko16, ...BaseStyle.mb10}}>아이디</Text>
          <TextInput
            value={userId}
            placeholder="아이디를 입력해주세요."
            style={{...BaseStyle.border, ...BaseStyle.ph10, ...BaseStyle.inputH}}
            autoCapitalize="none"
            keyboardType="default"
            onChange={text => setUserId(text)}
          />
        </View> */}
        <View style={{ ...BaseStyle.mb30, width: SCREEN_WIDTH - 40 }}>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb10 }}>휴대전화번호</Text>
          <View style={{ ...BaseStyle.container5, ...BackHandler.inputH }}>
            <TextInput
              value={userMobile}
              placeholder="휴대전화번호를 입력해주세요."
              style={{ ...BaseStyle.border, ...BaseStyle.ph10, flex: 3 }}
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={text => {
                setSendConfirmNumber(false);
                setUserMobile(text);
              }}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (!isSendConfirmNumber || timeOver) {
                  confirmPhoneNumber();
                }
              }}
              style={{
                flex: 1,
                ...BaseStyle.container0,
                ...BaseStyle.pv15,
                ...BaseStyle.ml5,
                borderWidth: 1,
                borderColor: timeOver
                  ? Primary.PointColor01
                  : isSendConfirmNumber
                  ? Primary.PointColor03
                  : Primary.PointColor01,
                borderRadius: 5,
                backgroundColor: timeOver
                  ? Primary.PointColor01
                  : isSendConfirmNumber
                  ? Primary.PointColor03
                  : Primary.PointColor01,
              }}>
              <Text style={{ ...BaseStyle.font_white }}>인증받기</Text>
            </TouchableOpacity>
          </View>

          <View style={{ ...BaseStyle.container5, ...BackHandler.inputH, ...BaseStyle.mt10 }}>
            <TextInput
              value={userInsertConfirmNumber}
              placeholder="인증번호를 입력해주세요."
              style={{ ...BaseStyle.border, ...BaseStyle.ph10, flex: 3 }}
              autoCapitalize="none"
              keyboardType="number-pad"
              onChangeText={text => setUserInsertConfirmNumber(text)}
            />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                if (isSendConfirmNumber && !timeOver) {
                  confirmNumberCheck();
                }
              }}
              style={{
                flex: 1,
                ...BaseStyle.container0,
                ...BaseStyle.pv15,
                ...BaseStyle.ml5,
                borderWidth: 1,
                borderColor:
                  isSendConfirmNumber && !isConfirmed && !timeOver
                    ? Primary.PointColor01
                    : Primary.PointColor03,
                borderRadius: 5,
                backgroundColor:
                  isSendConfirmNumber && !isConfirmed && !timeOver
                    ? Primary.PointColor01
                    : Primary.PointColor03,
              }}>
              <Text style={{ ...BaseStyle.font_white }}>{isConfirmed ? '인증됨' : '인증'}</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              ...BaseStyle.mv10,
            }}>
            {isCounter && (
              <CountDown
                minutes={minutes}
                setMinutes={setMinutes}
                seconds={seconds}
                setSeconds={setSeconds}
                onFailConfirm={onFailConfirm}
                timeOver={timeOver}
                setTimeOver={setTimeOver}
              />
            )}
          </View>
          {/* <Text style={{...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mt10}}>
            ※휴대전화번호를 입력해주세요.
          </Text> */}
        </View>
        {isConfirmed && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => navigation.navigate('SetNewPwd', { mt_id: userId })}
            style={{
              ...BaseStyle.mainBtn,
            }}>
            <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_white }}>비밀번호 변경하기</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FindPwd;
