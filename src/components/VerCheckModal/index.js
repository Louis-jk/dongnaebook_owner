import { View, Text, TouchableOpacity, KeyboardAvoidingView, Linking, Dimensions } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import BaseStyle, { Disable, Primary } from '../../styles/Base'

const VerCheckModal = ({ isVisible, storeUrl }) => {

	const NUMBER_OF_LINES = 5

  return (
    <Modal
			isVisible={isVisible}
			transparent
			statusBarTranslucent
			style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
			animationIn='slideInUp'
			animationInTiming={100}
		>
			<View
				style={{
					backgroundColor: '#fff',
					...BaseStyle.ph20, 
					...BaseStyle.pv20,
					borderRadius: 5
				}}
			>
				<Text style={{ textAlign: 'center', ...BaseStyle.ko16, ...BaseStyle.mb15, ...BaseStyle.font_bold }}>
					{`버전이 업데이트 되었습니다.\n업데이트 후 사용해주세요.`}
				</Text>
				<TouchableOpacity
					activeOpacity={1}
					onPress={() => Linking.openURL(storeUrl)} //storeUrl
					style={{ ...BaseStyle.container2, paddingVertical: 12, paddingHorizontal: 20, backgroundColor: Primary.PointColor01, borderRadius: 5 }}
				>
					<Text style={{ color: '#fff', ...BaseStyle.font_bold, marginTop: 2 }}>업데이트하기</Text>
				</TouchableOpacity>
			</View>
		</Modal>
  )
}

export default VerCheckModal