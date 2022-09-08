import { Platform } from 'react-native'
import Toast from 'react-native-toast-message'
import { getStatusBarHeight } from 'react-native-status-bar-height'

const cusToast = (message, duration, position, offset) => {
  Toast.show({
    type: 'custom_type', // success | error | info
    // position: position || (Platform.OS === 'ios' ? 'top' : 'bottom'),
    position: position || 'bottom',
    text1: message,
    // text2: '내용',
    visibilityTime: duration || 1000,
    autoHide: true,
    topOffset: Platform.OS === 'ios' ? 66 + getStatusBarHeight() : 10,
    bottomOffset: offset ? offset + 10 : Platform.OS === 'ios' ? 20 : 10,
    onShow: () => {},
    onHide: () => {}
  })
}

export default cusToast
