import { Image, TouchableOpacity, Dimensions } from 'react-native'
import React from 'react'
import Modal from 'react-native-modal'
import AutoHeightImage from 'react-native-auto-height-image'

const ImageModal = ({
    isModalVisible,
    toggleModal,
    selectImg
}) => {
  return (
    <Modal
			isVisible={isModalVisible}
			onBackdropPress={toggleModal}
			backdropOpacity={1}
			transparent
			statusBarTranslucent
			style={{ flex: 1, padding: 0, margin: 0 }}
		>
			<AutoHeightImage source={{ uri: `${selectImg}` }} width={Dimensions.get('window').width} />
			<TouchableOpacity
				activeOpacity={1}
				onPress={toggleModal}
				style={{
					position: 'absolute',
					top: 70,
					right: 10
				}}
			>
				<Image
					source={require('../../images/ic_del.png')}
					style={{ width: 30, height: 30, resizeMode: 'contain' }}
				/>
			</TouchableOpacity>
		</Modal>
  )
}

export default ImageModal