import { View, Text, TouchableOpacity, KeyboardAvoidingView, TextInput, Platform } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import BaseStyle, { Disable, Primary } from '../../styles/Base'

const ReplyModal = ({
	isCommentModalVisible,
	selectReply,
	setSelectReply,
	toggleCommentModal,
	setReply
}) => {

	const NUMBER_OF_LINES = 5

  return (
    <Modal
			isVisible={isCommentModalVisible}
			transparent
			statusBarTranslucent
			style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
			animationIn='slideInUp'
			animationInTiming={100}
		>
			<KeyboardAvoidingView
				behavior='position'
				style={{ backgroundColor: '#fff', borderRadius: 15 }}
				enabled
			>
				<View
					style={{
						position: 'relative',
						backgroundColor: '#fff',
						...BaseStyle.pv30,
						justifyContent: 'center',
						alignItems: 'center',
						borderRadius: 5
					}}
				>
					<Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb15, ...BaseStyle.font_bold }}>
						리뷰에 대한 답변을 입력해주세요.
					</Text>
					<View style={{ width: '100%', ...BaseStyle.ph30 }}>
						<View style={{ ...BaseStyle.ph10, backgroundColor: Disable.lightGray, borderRadius: 5 }}>
							<TextInput
								value={selectReply}
								style={{
									width: '100%',
									...BaseStyle.ko15,
									...BaseStyle.lh24,
									...BaseStyle.mv15
								}, Platform.OS === 'ios' && { ...BaseStyle.mh10, ...BaseStyle.mv10 }}
								multiline
								numberOfLines={Platform.OS === 'android' ? NUMBER_OF_LINES : null}
								minHeight={Platform.OS === 'android' ? null : NUMBER_OF_LINES * 20}
								textAlignVertical='top'
								placeholder='답변을 입력해주세요.'
								underlineColorAndroid='transparent'
								onChangeText={text => setSelectReply(text)}
								autoCapitalize='none'
							/>
						</View>
					</View>
					<View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph30 }}>
						<TouchableOpacity
							activeOpacity={1}
							onPress={() => {
								if (selectReply !== null && selectReply !== '') {
									setReply()
								}
							}}
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								width: '100%',
								borderWidth: 1,
								borderColor: selectReply !== null && selectReply !== '' ? Primary.PointColor01 : Disable.lightGray,
								backgroundColor: selectReply !== null && selectReply !== '' ? Primary.PointColor01 : '#fff',
								paddingVertical: 15,
								flex: 1,
								...BaseStyle.pv15,
								borderTopLeftRadius: 5,
								borderBottomLeftRadius: 5
							}}
						>
							<Text
								style={{
									...BaseStyle.ko14,
									color: selectReply !== null && selectReply !== '' ? '#fff' : Primary.PointColor03
								}}
							>
								답변 전송
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							activeOpacity={1}
							onPress={toggleCommentModal}
							style={{
								alignItems: 'center',
								justifyContent: 'center',
								width: '100%',
								borderWidth: 1,
								borderColor: Disable.lightGray,
								backgroundColor: Disable.lightGray,
								paddingVertical: 15,
								flex: 1,
								...BaseStyle.pv15,
								borderTopRightRadius: 5,
								borderBottomRightRadius: 5
							}}
						>
							<Text
								style={{
									...BaseStyle.ko14,
									color: '#666'
								}}
							>
								취소
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</KeyboardAvoidingView>
		</Modal>
  )
}

export default ReplyModal