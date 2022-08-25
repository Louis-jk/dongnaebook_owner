import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Dimensions, TouchableOpacity, Image, Alert } from 'react-native'
import ImagePicker from 'react-native-image-crop-picker'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import AutoHeightImage from 'react-native-auto-height-image'
import Header from '../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import cusToast from '../components/CusToast'
import Api from '../Api'

const MAIN_IMAGE_THUMB_WIDTH = (Dimensions.get('window').width - 40) / 5 - 4

const ReviewNotice = props => {
  const { navigation } = props
  const { type, item } = props.route.params
  const [noticeContent, setNoticeContent] = useState('')
  const [source, setSource] = React.useState(null)

  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  console.log('props', props)

  function reviewNoticeInit () {
    if (type === 'edit') {
      setNoticeContent(item.noticeContent)

      if (item && item.noticePic && item.noticePic.length > 0) {
        item.noticePic.map((pic, index) => {
          const type = pic.slice(pic.lastIndexOf('.')).replace('.', '')
          // let name = pic.slice(pic.lastIndexOf('/')).replace('/', '').split('.')[0];
          const name = pic.slice(pic.lastIndexOf('/')).replace('/', '')

          setSource({
            uri: pic,
            type: `image/${type}`,
            name
          })
        })
      }
    }
  }

  useEffect(() => {
    reviewNoticeInit()

    return () => reviewNoticeInit()
  }, [type])

  // 대표이미지 업로드
  const openPickerHandler = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: false
    }).then(image => {
      console.log('image', image)
      if (image.length > 1) {
        cusToast('이미지는 1장만 등록하실 수 있습니다.')
      } else {
        // name: image.path.slice(image.path.lastIndexOf('/')).replace('/', '').split('.')[0],
        setSource({
          uri: image.path,
          type: image.mime,
          name: image.path.slice(image.path.lastIndexOf('/')).replace('/', '')
        })
      }
      imageOrCameraChoiceHandler()
    })
  }

  // 대표이미지 카메라 촬영
  const openCameraHandler = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 1000,
      cropping: true
    }).then(image => {
      // console.log('camera', image);
      setSource({
        uri: image.path,
        mime: image.mime,
        name: image.path.slice(image.path.lastIndexOf('/')).replace('/', '').split('.')[0]
      })
      imageOrCameraChoiceHandler()
    })
  }

  // 대표이미지 업로드 선택시 이미지 설정 or 카메라 선택 모달
  const [mediaChoiceModalVisible, setMediaChoiceModalVisible] = React.useState(false)
  const imageOrCameraChoiceHandler = () => {
    setMediaChoiceModalVisible(!mediaChoiceModalVisible)
  }

  // 대표이미지 삭제
  const deleteImage = path => {
    setSource(null)
    // let filteredArr = source.filter(img => img.uri !== path);
    // setSource(filteredArr);
  }

  // 빈 오브젝트 체킹
  const isEmptyObj = obj => {
    if (obj.constructor === Object && Object.keys(obj).length === 0) {
      return true
    }
    return false
  }

  // 리뷰 공지사항 등록하기
  const onSubmit = type => {
    console.log('type', type)

    if (!noticeContent) {
      cusToast('공지사항을 입력해주세요.')
      // Alert.alert('공지사항을 입력해주세요.')
      return false
    }

    let data = {}

    const arrImg = [source]

    const params2 = {}

    arrImg.map((arr, index) => {
      if (index === 4) {
        params2.rt_img5 = arr
      } else if (index === 3) {
        params2.rt_img4 = arr
      } else if (index === 2) {
        params2.rt_img3 = arr
      } else if (index === 1) {
        params2.rt_img2 = arr
      } else {
        params2.rt_img1 = arr
      }
    })

    if (type === 'edit') {
      data = {
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        wr_id: item.noticeWrid,
        wr_content: noticeContent
      }
    } else {
      data = {
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        wr_content: noticeContent
      }
    }

    Api.send3(
      type === 'edit' ? 'store_review_update' : 'store_review_write',
      data,
      params2,
      args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        console.log('====================================')
        console.log('리뷰 공지사항 resultItem', resultItem)
        console.log('리뷰 공지사항 arrItems', arrItems)
        console.log('====================================')

        if (resultItem.result === 'Y') {
          if (type === 'edit') {
            cusToast('리뷰 공지사항이 수정 되었습니다.')
            navigation.navigate('Reviews')
          } else {
            cusToast('리뷰 공지사항이 등록 되었습니다.')
            navigation.navigate('Reviews')
          }
        } else {
          if (type === 'edit') {
            cusToast('리뷰 공지사항을 수정 중에 오류가 발생하였습니다.')
          } else {
            cusToast('리뷰 공지사항을 등록 중에 오류가 발생하였습니다.')
          }
        }
      }
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <View style={{ zIndex: 99999, backgroundColor: '#fff' }}>
        <Header navigation={navigation} title='리뷰 공지작성' />
      </View>

      {/* 이미지 선택 or 카메라 선택 모달 */}
      <Modal
        isVisible={mediaChoiceModalVisible}
        transparent
        statusBarTranslucent
        onBackdropPress={imageOrCameraChoiceHandler}
        style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
        animationIn='slideInUp'
        animationInTiming={100}
      >
        <View
          style={{
            ...BaseStyle.container2,
            ...BaseStyle.pv30,
            ...BaseStyle.ph20,
            position: 'relative',
            backgroundColor: '#fff',
            borderRadius: 5
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={imageOrCameraChoiceHandler}
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
              source={require('../images/close.png')}
              style={{
                width: 12,
                height: 12,
                resizeMode: 'center'
              }}
            />
          </TouchableOpacity>
          {/* 이미지 등록 방법을 선택해주세요. */}
          <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb20 }}>
            어떤 방식으로 공지이미지를 올리시겠습니까?
          </Text>
          <View
            style={{
              ...BaseStyle.container4
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              onPress={openPickerHandler}
              style={{
                ...BaseStyle.container1,
                height: 45,
                backgroundColor: Primary.PointColor01,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5
              }}
            >
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>갤러리선택</Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={openCameraHandler}
              style={{
                ...BaseStyle.container1,
                height: 45,
                backgroundColor: Primary.PointColor02,
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5
              }}
            >
              <Text style={{ ...BaseStyle.ko14, color: '#fff' }}>사진촬영</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      {/* // 이미지 선택 or 카메라 선택 모달 */}

      <View style={{ paddingHorizontal: 20, paddingVertical: 20 }}>
        {/* 공지사항 글 입력 란 */}
        <View style={{ ...BaseStyle.ph10, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
          <TextInput
            value={noticeContent}
            style={{
              width: '100%',
              ...BaseStyle.ko15,
              ...BaseStyle.lh24,
              ...BaseStyle.mv15
            }}
            multiline
            numberOfLines={7}
            textAlignVertical='top'
            placeholder='리뷰 공지사항을 입력해주세요.'
            underlineColorAndroid='transparent'
            onChangeText={text => setNoticeContent(text)}
            autoCapitalize='none'
          />
        </View>
        {/* // 공지사항 글 입력 란 */}

        {/* 공지사항 이미지 */}
        <View style={{ ...BaseStyle.mt20 }}>
          <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
            리뷰 공지사항 이미지
          </Text>
          <Text style={{ ...BaseStyle.ko12, color: '#aaa' }}>
            (리뷰 공지사항 이미지는 1장만 등록 가능합니다.)
          </Text>
        </View>
        <View
          style={{
            width: '100%',
            ...BaseStyle.container,
            flexWrap: 'wrap',
            ...BaseStyle.mt10,
            ...BaseStyle.mb20
          }}
        >
          {source && source !== null && (
            <View style={{ borderWidth: 1, borderColor: '#ececec', borderRadius: 5 }}>
              <AutoHeightImage
                source={{ uri: `${source.uri}` }}
                width={Dimensions.get('window').width - 40}
                style={{ borderRadius: 5 }}
              />
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => deleteImage(source.uri)}
                style={{
                  position: 'absolute',
                  top: -7,
                  right: -7,
                  width: 25,
                  height: 25,
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: '#222',
                  borderRadius: 30
                }}
              >
                <Image
                  source={require('../images/close_wh.png')}
                  style={{
                    width: 10,
                    height: 10
                  }}
                  resizeMode='center'
                />
              </TouchableOpacity>
            </View>
          )}
          {source === null && (
            <TouchableOpacity
              activeOpacity={1}
              onPress={imageOrCameraChoiceHandler}
              style={{
                width: MAIN_IMAGE_THUMB_WIDTH,
                height: MAIN_IMAGE_THUMB_WIDTH,
                borderRadius: 5,
                backgroundColor: '#ececec',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <Text style={{ ...BaseStyle.ko24, color: '#aaa' }}>+</Text>
            </TouchableOpacity>
          )}
        </View>
        {/* // 공지사항 이미지 */}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => onSubmit(type === 'edit' ? 'edit' : 'write')}
          style={{ ...BaseStyle.mainBtn }}
        >
          <Text style={{ ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
            {type === 'edit' ? '수정하기' : '등록하기'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ReviewNotice
