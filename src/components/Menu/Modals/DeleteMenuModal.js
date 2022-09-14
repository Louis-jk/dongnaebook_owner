import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import BaseStyle, {Primary} from '../../../styles/Base'

const DeleteMenuModal = ({
  isModalVisible,
  toggleModal,
  sendMenuDeleteHandler
}) => {
  return (
    <View>
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
              backgroundColor: Primary.PointColor02,
              borderRadius: 50,
              padding: 10
            }}
          >
            <Image
              source={require('../../../images/close_wh.png')}
              style={{ width: 10, height: 10 }}
              resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
            />
          </TouchableOpacity>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb15 }}>
            메뉴를 정말 삭제하시겠습니까?
          </Text>

          {/* 배달완료 처리 | 취소 버튼 영역 */}
          <View style={{ ...BaseStyle.container5, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={toggleModal}
              style={{ flex: 1, ...BaseStyle.pv15, backgroundColor: Primary.PointColor03, borderTopLeftRadius: 5, borderBottomLeftRadius: 5 }}
            >
              <Text style={{ textAlign: 'center', ...BaseStyle.ko14 }}>취소</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={sendMenuDeleteHandler}
              style={{ flex: 1, ...BaseStyle.pv15, backgroundColor: Primary.PointColor01, borderTopRightRadius: 5, borderBottomRightRadius: 5 }}
            >
              <Text style={{ textAlign: 'center', ...BaseStyle.ko14, ...BaseStyle.font_white }}>삭제</Text>
            </TouchableOpacity>
          </View>
          {/* // 배달완료 처리 | 취소 버튼 영역 */}
        </View>
      </Modal>
    </View>
  )
}

export default DeleteMenuModal