import { View, Text, Image, TouchableOpacity, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import BaseStyle, { Primary } from '../../styles/Base'

const SendSpamModal = ({ isSpamReviewModalVisible, toggleSpamModal, sendSpamReviewHandler }) => {
  return (
		<Modal
				isVisible={isSpamReviewModalVisible}
				onBackdropPress={toggleSpamModal}
				transparent
				statusBarTranslucent
				style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
				animationIn='slideInUp'
				animationInTiming={100}
			>
				<View
						style={{
								backgroundColor: '#fff',
								...BaseStyle.pv30,
								justifyContent: 'center',
								alignItems: 'center',
								borderRadius: 5
						}}
						>
						<TouchableOpacity
								activeOpacity={1}
								onPress={toggleSpamModal}
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
								source={require('../../images/close.png')}
								style={{
										width: 12,
										height: 12
								}}
								resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
							/>
						</TouchableOpacity>
						<Text style={{ ...BaseStyle.ko14 }}>악성 리뷰로 신고하시겠습니까?</Text>
						<View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph20 }}>
							<TouchableOpacity
								activeOpacity={1}
								onPress={sendSpamReviewHandler}
								style={{
										...BaseStyle.container1,
										height: 45,
										backgroundColor: Primary.PointColor01,
										borderTopLeftRadius: 5,
										borderBottomLeftRadius: 5
									}}
								>
									<Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>신고하기</Text>
								</TouchableOpacity>
								<TouchableOpacity
									activeOpacity={1}
									onPress={toggleSpamModal}
									style={{
										...BaseStyle.container1,
										height: 45,
										backgroundColor: Primary.PointColor03,
										borderTopRightRadius: 5,
										borderBottomRightRadius: 5
									}}
								>
									<Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>취소</Text>
								</TouchableOpacity>
						</View>
				</View>
			</Modal>
  )
}

export default SendSpamModal