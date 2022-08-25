import { View, Text } from 'react-native'
import React from 'react'
import cusToast from './CusToast'

const CountDown = ({
  minutes,
  setMinutes,
  seconds,
  setSeconds,
  onFailConfirm,
  timeOver,
  setTimeOver
}) => {
  React.useEffect(() => {
    setTimeOver(false)
    const countdown = setInterval(() => {
      if (parseInt(seconds) > 0) {
        setSeconds(parseInt(seconds) - 1)
      }
      if (parseInt(seconds) === 0) {
        if (parseInt(minutes) === 0) {
          clearInterval(countdown)
          onFailConfirm()
          setTimeOver(true)
          cusToast('인증번호 입력시간이 초과되었습니다.\n인증번호를 다시 전송해주세요.', 2500)
        } else {
          setMinutes(parseInt(minutes) - 1)
          setSeconds(59)
        }
      }
    }, 1000)
    return () => clearInterval(countdown)
  }, [minutes, seconds])

  return (
    <>
      {!timeOver && (
        <View>
          <Text style={{ color: '#000' }}>
            {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
          </Text>
        </View>
      )}
      {timeOver && (
        <View
          style={{
            marginBottom: 10
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: '#ff5e78',
              marginRight: 5
            }}
          >
            입력시간이 초과되었습니다.
          </Text>
        </View>
      )}
    </>
  )
}

export default CountDown
