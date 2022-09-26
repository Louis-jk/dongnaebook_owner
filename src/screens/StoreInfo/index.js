import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  BackHandler,
  Platform
} from 'react-native'
import { useSelector } from 'react-redux'
import ImagePicker from 'react-native-image-crop-picker'
import Modal from 'react-native-modal'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import Api from '../../Api'
import cusToast from '../../components/CusToast'
import AnimateLoading from '../../components/Loading/AnimateLoading'
import { pickGalleryImage } from '../../modules/imagePickerOrCamera'

const MAIN_IMAGE_THUMB_WIDTH = (Dimensions.get('window').width - 40) / 5 - 4

const StoreInfo = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const [storeInit, setStoreInit] = React.useState(false) // 매장 정보 초기값 유무

  const [showDefault, setShowDefault] = React.useState(true) // 이미지 로딩
  const [imageError, setImageError] = React.useState(false) // 이미지 에러

  const [fileImgs01, setFileImgs01] = React.useState(null) // File 대표이미지01
  const [fileImgs02, setFileImgs02] = React.useState(null) // File 대표이미지02
  const [fileImgs03, setFileImgs03] = React.useState(null) // File 대표이미지03
  const [fileImgs04, setFileImgs04] = React.useState(null) // File 대표이미지04
  const [fileImgs05, setFileImgs05] = React.useState(null) // File 대표이미지05

  const [detailImgs01, setDetailImgs01] = React.useState('') // base64 대표이미지01
  const [detailImgs02, setDetailImgs02] = React.useState('') // base64 대표이미지02
  const [detailImgs03, setDetailImgs03] = React.useState('') // base64 대표이미지03
  const [detailImgs04, setDetailImgs04] = React.useState('') // base64 대표이미지04
  const [detailImgs05, setDetailImgs05] = React.useState('') // base64 대표이미지05

  const [storeLogoChange, setStoreLogoChange] = React.useState(false); // 로고 이미지 변경 사항 0: 변경없음 | 1 : 변경
  const [storeLogoFileObj, setStoreLogoFileObj] = React.useState(''); // 로고 이미지 파일 객체
  const [storeLogo, setStoreLogo] = React.useState(''); // 로고 이미지

  const [isLoading, setLoading] = React.useState(true)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  // 매장소개 정보
  const [info, setInfo] = React.useState({
    do_jumju_introduction: null, // 매장소개
    do_jumju_info: null, // ??
    do_jumju_guide: null, // 안내 및 혜택
    do_jumju_menu_info: null, // 메뉴 소개
    do_major_menu: null, // 대표메뉴
    do_jumju_origin: null, // 원산지 안내
    do_jumju_origin_use: null, // 원산지 표시 유무
    do_take_out: null, // 포장 가능 유무
    do_coupon_use: null, // 쿠폰 사용 유무
    do_delivery_time: null, // 평균 배달 시간
    do_cooking_time: null, // 평균 조리 시간
    do_end_state: null, // 주문마감
    mt_sound: null, // 알림 설정(1회, 2회, 3회)
    mb_one_saving: null, // 1인분 가능
    pic: [] // 매장 대표 이미지 (5개까지)
  })

  const param = {
    encodeJson: true,
    jumju_id: mtId,
    jumju_code: mtJumjuCode
  }

  const getStoreInfo = () => {
    Api.send('store_guide', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      console.log('====================================');
      console.log('store guide arrItems ?', arrItems);
      console.log('====================================');

      if (resultItem.result === 'Y') {
        setStoreInit(true)
        setInfo({
          do_jumju_introduction: arrItems.do_jumju_introduction,
          do_jumju_info: arrItems.do_jumju_info,
          do_jumju_guide: arrItems.do_jumju_guide,
          do_jumju_menu_info: arrItems.do_jumju_menu_info,
          do_major_menu: arrItems.do_major_menu,
          do_jumju_origin: arrItems.do_jumju_origin,
          do_jumju_origin_use: arrItems.do_jumju_origin_use,
          do_take_out: arrItems.do_take_out,
          do_coupon_use: arrItems.do_coupon_use,
          do_delivery_guide: arrItems.do_delivery_guide,
          do_delivery_time: arrItems.do_delivery_time,
          do_cooking_time: arrItems.do_cooking_time,
          do_end_state: arrItems.do_end_state,
          mt_sound: arrItems.mt_sound,
          mb_one_saving: arrItems.mb_one_saving,
          pic: arrItems.pic
        })

        // console.log('arrItems.pic', arrItems.pic)

        setDetailImgs01(arrItems.pic[0].img)
        setDetailImgs02(arrItems.pic[1].img)
        setDetailImgs03(arrItems.pic[2].img)
        setDetailImgs04(arrItems.pic[3].img)
        setDetailImgs05(arrItems.pic[4].img)
      } else {
        setStoreInit(false)
        setInfo({
          do_jumju_introduction: null,
          do_jumju_info: null,
          do_jumju_guide: null,
          do_jumju_menu_info: null,
          do_major_menu: null,
          do_jumju_origin: null,
        do_jumju_origin_use: null,
          do_take_out: null,
          do_coupon_use: null,
          do_delivery_guide: null,
          do_delivery_time: null,
          do_cooking_time: null,
          do_end_state: null,
          mt_sound: null,
          mb_one_saving: null,
          pic: []
        })
      }

      setStoreLogo(arrItems.mt_icon)
      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getStoreInfo()
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const onSubmitStoreInfo = () => {

    const data = {
      mode: 'insert',
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      do_jumju_introduction: info.do_jumju_introduction,
      do_jumju_guide: info.do_jumju_guide,
      do_jumju_menu_info: info.do_jumju_menu_info,
      do_major_menu: info.do_major_menu,
      do_jumju_origin: info.do_jumju_origin,
      do_jumju_origin_use: info.do_jumju_origin_use,
      do_take_out: info.do_take_out,
      do_coupon_use: info.do_coupon_use,
      do_delivery_time: info.do_delivery_time,
      do_cooking_time: info.do_cooking_time,
      do_end_state: info.do_end_state,
      mt_sound: info.mt_sound,
      mb_one_saving: info.mb_one_saving,
      mb_icon: storeLogoChange ? storeLogoFileObj : null,
      mb_icon_del : storeLogoChange ? 1 : 0
    }

    Api.send('store_guide_update', data, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        cusToast('매장정보를 등록하였습니다.\메인화면으로 이동합니다.', 1500)
        setTimeout(() => {
          navigation.navigate('Home', { screen: 'Main' })
        }, 1500)
      }
    })
  }

  const introduceRef = React.useRef(null) // 매장소개 ref
  const majorMenuRef = React.useRef(null) // 대표메뉴 ref
  const originRef = React.useRef(null) // 원산지안내 ref

  const onModifyStoreInfo = () => {

    if (info.do_jumju_introduction === null || info.do_jumju_introduction === '') {
      cusToast('매장 소개를 입력해주세요.', 1500, 'top')
      // introduceRef.current.focus()
    } else if (info.do_major_menu === null || info.do_major_menu === '') {
      cusToast('대표메뉴를 입력해주세요.', 1500, 'top')
      // majorMenuRef.current.focus()
    } else if (info.do_jumju_origin === null || info.do_jumju_origin === '') {
      cusToast('원산지 안내를 입력해주세요.', 1500, 'top')
      // originRef.current.focus()
    } else {
      const data = {
        mode: 'update',
        encodeJson: true,
        jumju_id: mtId,
        jumju_code: mtJumjuCode,
        do_jumju_introduction: info.do_jumju_introduction,
        do_jumju_guide: info.do_jumju_guide,
        do_jumju_menu_info: info.do_jumju_menu_info,
        do_major_menu: info.do_major_menu,
        do_jumju_origin: info.do_jumju_origin,
        do_jumju_origin_use: info.do_jumju_origin_use,
        do_take_out: info.do_take_out,
        do_coupon_use: info.do_coupon_use,
        do_delivery_guide: info.do_delivery_guide,
        do_delivery_time: info.do_delivery_time,
        do_cooking_time: info.do_cooking_time,
        do_end_state: info.do_end_state,
        mt_sound: info.mt_sound,
        mb_one_saving: info.mb_one_saving,
        rt_img_del1: detailImgs01 !== '' ? 0 : 1,
        rt_img_del2: detailImgs02 !== '' ? 0 : 1,
        rt_img_del3: detailImgs03 !== '' ? 0 : 1,
        rt_img_del4: detailImgs04 !== '' ? 0 : 1,
        rt_img_del5: detailImgs05 !== '' ? 0 : 1,
        mb_icon_del : storeLogoChange ? 1 : 0
      }

      // 대표 이미지가 있을 경우
      const params2 = {
        rt_img1: fileImgs01 !== null ? fileImgs01 : '',
        rt_img2: fileImgs02 !== null ? fileImgs02 : '',
        rt_img3: fileImgs03 !== null ? fileImgs03 : '',
        rt_img4: fileImgs04 !== null ? fileImgs04 : '',
        rt_img5: fileImgs05 !== null ? fileImgs05 : '',
        mb_icon: storeLogoChange ? storeLogoFileObj : null,        
      }

      Api.send3('store_guide_update', data, params2, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === 'Y') {
          cusToast('매장정보를 수정 하였습니다.\n메인화면으로 이동합니다.', 1500)
          setTimeout(() => {
            navigation.navigate('Home', { screen: 'Main' })
          }, 1500)
        } else {
          cusToast('매장정보를 수정하는 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 2500)
        }
      })
    }
  }

  // 대표이미지 업로드
  const openPickerHandler = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: true
    })
      .then(image => {
        console.log('image', image)
        console.log('currentIndex', currentIndex)

        const imageExt = image[0].mime.split('/')
        console.log('imageExt', imageExt[1])

        if (
          imageExt[1] !== 'jpeg' &&
          imageExt[1] !== 'jpg' &&
          imageExt[1] !== 'png' &&
          imageExt[1] !== 'bmp'
        ) {
          imageOrCameraChoiceHandler()
          cusToast('업로드 가능한 이미지 형식이 아닙니다.')
        } else if (imageExt[0] !== 'image') {
          imageOrCameraChoiceHandler()
          cusToast('이미지만 업로드 할 수 있습니다.')
        } else {
          if (currentIndex === 1) {
            setDetailImgs01(image[0].path)
            setFileImgs01({
              uri: image[0].path,
              type: image[0].mime,
              name: image[0].path.slice(image[0].path.lastIndexOf('/'))
            })
          } else if (currentIndex === 2) {
            setDetailImgs02(image[0].path)
            setFileImgs02({
              uri: image[0].path,
              type: image[0].mime,
              name: image[0].path.slice(image[0].path.lastIndexOf('/'))
            })
          } else if (currentIndex === 3) {
            setDetailImgs03(image[0].path)
            setFileImgs03({
              uri: image[0].path,
              type: image[0].mime,
              name: image[0].path.slice(image[0].path.lastIndexOf('/'))
            })
          } else if (currentIndex === 4) {
            setDetailImgs04(image[0].path)
            setFileImgs04({
              uri: image[0].path,
              type: image[0].mime,
              name: image[0].path.slice(image[0].path.lastIndexOf('/'))
            })
          } else if (currentIndex === 5) {
            setDetailImgs05(image[0].path)
            setFileImgs05({
              uri: image[0].path,
              type: image[0].mime,
              name: image[0].path.slice(image[0].path.lastIndexOf('/'))
            })
          } else {
            return false
          }

          imageOrCameraChoiceHandler()
        }
      })
      .catch(err => {
        console.log('이미지 업로드 error', err)
        imageOrCameraChoiceHandler()
      })
  }

  // 대표이미지 카메라 촬영
  const openCameraHandler = () => {
    ImagePicker.openCamera({
      width: 1000,
      height: 800,
      cropping: true
    })
      .then(image => {
        console.log('camera', image)

        if (currentIndex === 1) {
          setDetailImgs01(image.path)
          setFileImgs01({
            uri: image.path,
            type: image.mime,
            name: image.path.slice(image.path.lastIndexOf('/'))
          })
        } else if (currentIndex === 2) {
          setDetailImgs02(image.path)
          setFileImgs02({
            uri: image.path,
            type: image.mime,
            name: image.path.slice(image.path.lastIndexOf('/'))
          })
        } else if (currentIndex === 3) {
          setDetailImgs03(image.path)
          setFileImgs03({
            uri: image.path,
            type: image.mime,
            name: image.path.slice(image.path.lastIndexOf('/'))
          })
        } else if (currentIndex === 4) {
          setDetailImgs04(image.path)
          setFileImgs04({
            uri: image.path,
            type: image.mime,
            name: image.path.slice(image.path.lastIndexOf('/'))
          })
        } else if (currentIndex === 5) {
          setDetailImgs05(image.path)
          setFileImgs05({
            uri: image.path,
            type: image.mime,
            name: image.path.slice(image.path.lastIndexOf('/'))
          })
        } else {
          return false
        }

        imageOrCameraChoiceHandler()
      })
      .catch(err => {
        console.log('camera error', err)
        imageOrCameraChoiceHandler()
      })
  }

  // 대표이미지 업로드 선택시 이미지 설정 or 카메라 선택 모달
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [mediaChoiceModalVisible, setMediaChoiceModalVisible] = React.useState(false)
  const imageOrCameraChoiceHandler = index => {
    setCurrentIndex(index)
    setMediaChoiceModalVisible(!mediaChoiceModalVisible)
  }

  // 대표이미지 삭제
  const deleteImage = index => {
    if (index == 1) {
      setDetailImgs01('')
    } else if (index == 2) {
      setDetailImgs02('')
    } else if (index == 3) {
      setDetailImgs03('')
    } else if (index == 4) {
      setDetailImgs04('')
    } else if (index == 5) {
      setDetailImgs05('')
    } else {
      return false
    }
    // let filteredArr = source.filter(img => img.uri !== path);
    // setSource(filteredArr);
  }

  const UploadImageBox = ({ imgPath, index }) => {
    console.log('imgPath', imgPath)
    return (
      <View style={{ position: 'relative' }}>
        <Image
          source={{ uri: `${imgPath}` }}
          style={{
            width: MAIN_IMAGE_THUMB_WIDTH,
            height: MAIN_IMAGE_THUMB_WIDTH - 10,
            borderRadius: 5
          }}
          resizeMode='cover'
          onError={() => setImageError(true)}
          onLoadEnd={() => setShowDefault(false)}
        />
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => deleteImage(index)}
          style={{
            position: 'absolute',
            top: 2,
            right: 2,
            width: 20,
            height: 20,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#222',
            borderRadius: 30
          }}
        >
          <Image
            source={require('../../images/close_wh.png')}
            style={{
              width: 10,
              height: 10
            }}
            resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
          />
        </TouchableOpacity>
      </View>
    )
  }

  const EmptyImageSelectBox = ({ index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => imageOrCameraChoiceHandler(index)}
        style={{
          width: MAIN_IMAGE_THUMB_WIDTH,
          height: MAIN_IMAGE_THUMB_WIDTH - 10,
          borderRadius: 5,
          backgroundColor: '#ececec',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Text style={{ ...BaseStyle.ko24, color: '#aaa', marginTop: Platform.OS === 'ios' ? -5 : 0 }}>+</Text>
      </TouchableOpacity>
    )
  }

  // 이미지 업로드 핸들러
  const pickImageHandler = () => {
    setStoreLogoChange(true)
    pickGalleryImage(setStoreLogoFileObj, setStoreLogo, 300)
  }

  return (

    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title='매장소개' />

          {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

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
                  source={require('../../images/close.png')}
                  style={{
                    width: 12,
                    height: 12
                  }}
                  resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                />
              </TouchableOpacity>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb20 }}>
                어떤 방식으로 대표이미지를 올리시겠습니까?
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
                  <Text style={{ ...BaseStyle.ko1, ...BaseStyle.font_white }}>갤러리선택</Text>
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
                  <Text
                    style={{
                      ...BaseStyle.ko14,
                      color: '#fff'
                    }}
                  >
                    사진촬영
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            <View>
              <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
                <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb20 }}>
                  ※ 표시는 필수 입력란 입니다.
                </Text>

                {/* 로고 설정 */}
                <View style={{ ...BaseStyle.container3 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
                    로고 설정
                  </Text>
                </View>
                
                <View
                  style={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ...BaseStyle.mv10,
                    ...BaseStyle.mb20
                  }}
                >
                  {storeLogo !== '' && 
                    <>
                      <Image source={{ uri: `${storeLogo}` }} style={{ width: '100%', height: '100%', borderWidth: 1, borderColor: '#ececec', borderRadius: 5 }} resizeMode='cover' />
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => setStoreLogo('')}
                        hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
                        style={{
                          position: 'absolute',
                          top: 2,
                          right: 2,
                          width: 20,
                          height: 20,
                          justifyContent: 'center',
                          alignItems: 'center',
                          backgroundColor: '#222',
                          borderRadius: 30
                        }}
                      >
                        <Image
                          source={require('../../images/close_wh.png')}
                          style={{
                            width: 10,
                            height: 10
                          }}
                          resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                        />
                      </TouchableOpacity>
                    </>
                  }

                  {!storeLogo && 
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={pickImageHandler}
                      style={{
                        width: '100%', 
                        height: '100%',
                        borderRadius: 5,
                        backgroundColor: '#ececec',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text style={{ ...BaseStyle.ko24, color: '#aaa', marginTop: Platform.OS === 'ios' ? -5 : 0 }}>+</Text>
                    </TouchableOpacity>
                  }
                </View>
                
                {/* // 로고 설정 */}

                {/* 대표 이미지 설정 */}
                <View style={{ ...BaseStyle.container3 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
                    대표 이미지
                  </Text>
                  <View>
                    <Text style={{ ...BaseStyle.ko12, color: '#aaa', ...BaseStyle.mb3 }}>
                      (대표 이미지는 5장까지 등록 가능합니다.)
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: '#aaa' }}>
                      ※ 이미지는 4:3 비율을 권장합니다.
                    </Text>
                  </View>
                </View>
                <View
                  style={{
                    width: '100%',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    ...BaseStyle.mv10
                  }}
                >
                  {/* 신규 */}
                  {detailImgs01 !== '' ? (<UploadImageBox imgPath={detailImgs01} index={1} />) : (<EmptyImageSelectBox index={1} />)}

                  {detailImgs02 !== '' ? (<UploadImageBox imgPath={detailImgs02} index={2} />) : (<EmptyImageSelectBox index={2} />)}

                  {detailImgs03 !== '' ? (<UploadImageBox imgPath={detailImgs03} index={3} />) : (<EmptyImageSelectBox index={3} />)}

                  {detailImgs04 !== '' ? (<UploadImageBox imgPath={detailImgs04} index={4} />) : (<EmptyImageSelectBox index={4} />)}

                  {detailImgs05 !== '' ? (<UploadImageBox imgPath={detailImgs05} index={5} />) : (<EmptyImageSelectBox index={5} />)}
                  {/* //신규 */}
                </View>
                {/* // 대표 이미지 설정 */}

                {/* 매장 소개 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              매장 소개
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      매장 소개
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150
                    }}
                  >
                    <TextInput
                      ref={introduceRef}
                      value={info.do_jumju_introduction}
                      placeholder='매장에 대한 설명을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setInfo({ ...info, do_jumju_introduction: text })}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                </View>
                {/* // 매장 소개 */}

                {/* 안내 및 혜택 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    안내 및 혜택
                  </Text>
                  {/* <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>안내 및 혜택</Text>
                <Text style={{...BaseStyle.ko12, color:Primary.PointColor02}}>※</Text>
              </View> */}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150
                    }}
                  >
                    <TextInput
                      value={info.do_jumju_guide}
                      placeholder='안내 및 혜택이 있을 시 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setInfo({ ...info, do_jumju_guide: text })}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                </View>
                {/* // 안내 및 혜택 */}

                {/* 메뉴 소개 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    안내 및 메뉴 소개
                  </Text>
                  {/* <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>메뉴 소개</Text>
                <Text style={{...BaseStyle.ko12, color:Primary.PointColor02}}>※</Text>
              </View> */}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150
                    }}
                  >
                    <TextInput
                      value={info.do_jumju_menu_info}
                      placeholder='안내 및 메뉴 소개가 있을 시 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setInfo({ ...info, do_jumju_menu_info: text })}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                </View>
                {/* // 메뉴 소개 */}

                {/* 대표 메뉴 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              대표 메뉴
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      대표 메뉴
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View
                    style={{
                      ...BaseStyle.container5,
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.inputH,
                      ...BaseStyle.ph10
                    }}
                  >
                    <TextInput
                      ref={majorMenuRef}
                      value={info.do_major_menu}
                      placeholder='대표 메뉴을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.inputH,
                        ...BaseStyle.ko14,
                        marginTop: Platform.OS === 'android' ? 10 : 0
                      }}
                      onChangeText={text => setInfo({ ...info, do_major_menu: text })}
                      autoCapitalize='none'
                    />
                  </View>
                  {/* <Text style={{...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mt5}}>
                대표메뉴 윗부분에 보여지는 글 입니다.
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mt5 }}>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        ...BaseStyle.lh17,
                        color: Primary.PointColor02,
                        ...BaseStyle.mr5
                      }}
                    >
                      ※
                    </Text>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        ...BaseStyle.lh17,
                        color: Primary.PointColor02,
                        flex: 1,
                        flexWrap: 'wrap'
                      }}
                    >
                      입력하실 때는 콤마(,)로 구분하여 입력해주세요.
                    </Text>
                  </View>
                </View>
                {/* // 대표 메뉴 */}

                {/* 원산지 안내 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              원산지 안내
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      원산지 안내
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150
                    }}
                  >
                    <TextInput
                      ref={originRef}
                      value={info.do_jumju_origin}
                      placeholder='원산지 안내가 있을 시 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setInfo({ ...info, do_jumju_origin: text })}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                </View>
                {/* // 원산지 안내 */}

                {/* 원산지 표시 유무 삭제요청 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              원산지 표시 유무
              </Text> */}
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text
                      style={{
                        ...BaseStyle.ko15,
                        ...BaseStyle.font_bold,
                        ...BaseStyle.mr5
                      }}
                    >
                      원산지 표시 유무
                    </Text>
                    <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                  </View>
                  <View style={{ ...BaseStyle.container, ...BaseStyle.mv10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setInfo({ ...info, do_jumju_origin_use: 'Y' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr20 }}
                    >
                      <Image
                        source={
                      info.do_jumju_origin_use === 'Y'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>원산지 노출</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={() => setInfo({ ...info, do_jumju_origin_use: 'N' })}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
                    >
                      <Image
                        source={
                      info.do_jumju_origin_use === 'N'
                        ? require('../../images/ic_check_on.png')
                        : require('../../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      <Text style={{ ...BaseStyle.ko14 }}>원산지 노출 안함</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 원산지 표시 유무 */}

                {/* 배달팁 안내 삭제요청(배달팁 안내 페이지로 이동 요청) */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text
                    style={{
                      ...BaseStyle.ko15,
                      ...BaseStyle.font_bold,
                      ...BaseStyle.mb10
                    }}
                  >
                    배달팁 안내
                  </Text>
                  {/* <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>배달팁 안내</Text>
                <Text style={{...BaseStyle.ko12, color:Primary.PointColor02}}>※</Text>
              </View> */}
                  <View
                    style={{
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.ph10,
                      height: 150
                    }}
                  >
                    <TextInput
                      value={info.do_delivery_guide}
                      placeholder='배달팁 안내가 있을 시 입력해주세요.'
                      textContentType='addressCity'
                      style={{
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setInfo({ ...info, do_delivery_guide: text })}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mt5 }}>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        ...BaseStyle.lh17,
                        color: Primary.PointColor02,
                        ...BaseStyle.mr5
                      }}
                    >
                      ※
                    </Text>
                    <Text
                      style={{
                        ...BaseStyle.ko12,
                        ...BaseStyle.lh17,
                        color: Primary.PointColor02,
                        flex: 1,
                        flexWrap: 'wrap'
                      }}
                    >
                      {
                    '배달팁은 가게에서 책정한 금액입니다.\n동네북은 배달팁 결제만 대행할 뿐, 금액은 가게로 전달됩니다'
                  }
                    </Text>
                  </View>
                </View>
                {/* // 배달팁 안내 */}

                {/* 평균 배달 시간 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    평균 배달 시간
                  </Text>
                  <View
                    style={{
                      ...BaseStyle.container5,
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.inputH,
                      ...BaseStyle.ph10
                    }}
                  >
                    <TextInput
                      value={info.do_delivery_time}
                      placeholder='평균 배달 시간을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.inputH,
                        ...BaseStyle.ko14,
                        marginTop: Platform.OS === 'android' ? 10 : 0
                      }}
                      onChangeText={text => setInfo({ ...info, do_delivery_time: text })}
                      autoCapitalize='none'
                    />
                  </View>
                </View>
                {/* // 평균 배달 시간 */}

                 {/* 평균 조리 시간 */}
                 <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    평균 조리 시간
                  </Text>
                  <View
                    style={{
                      ...BaseStyle.container5,
                      borderWidth: 1,
                      borderColor: '#E3E3E3',
                      ...BaseStyle.round05,
                      ...BaseStyle.inputH,
                      ...BaseStyle.ph10
                    }}
                  >
                    <TextInput
                      value={info.do_cooking_time}
                      placeholder='평균 조리 시간을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.inputH,
                        ...BaseStyle.ko14,
                        marginTop: Platform.OS === 'android' ? 10 : 0
                      }}
                      onChangeText={text => setInfo({ ...info, do_cooking_time: text })}
                      autoCapitalize='none'
                    />
                  </View>
                </View>
                {/* // 평균 조리 시간 */}
              </View>
            </View>
          </ScrollView>
          {storeInit ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onModifyStoreInfo}
              style={{ ...BaseStyle.mainBtnBottom }}
            >
              <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
                수정하기
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={onSubmitStoreInfo}
              style={{ ...BaseStyle.mainBtnBottom }}
            >
              <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>등록하기</Text>
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.goBack()}
        style={{...BaseStyle.mainBtnBottom, backgroundColor:'#e5e5e5'}}
      >
        <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold}}>나가기</Text>
      </TouchableOpacity> */}
        </View>}
    </>
  )
}

export default StoreInfo
