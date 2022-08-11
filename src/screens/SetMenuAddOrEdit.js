import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select' // 셀렉트박스 패키지
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import Header from '../components/SubHeader'
import BaseStyle, { Primary, customPickerStyles } from '../styles/Base'
import cusToast from '../components/CusToast'
import checkMenuValidate from '../modules/menuValidate'
import Api from '../Api'
import AnimateLoading from '../components/AnimateLoading'
import { pickGalleryImage, takeCamera } from '../modules/imagePickerOrCamera'
import Categories from '../components/Categories'

const SetMenuAddOrEdit = props => {
  const { navigation, route } = props
  const { type } = route.params
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const [menuId, setMenuId] = React.useState('') // 메뉴 ID
  const [selectCategory, setSelectCategory] = React.useState('') // 2차분류
  const [name, setName] = React.useState('') // 상품명
  const [menuShortDesc, setMenuShortDesc] = React.useState('') // 기본설명
  const [salePrice, setSalePrice] = React.useState('') // 판매가격
  const [description, setDescription] = React.useState('') // 메뉴 상세설명
  const [checkMain, setCheckMain] = React.useState(false) // 메뉴 대표메뉴 설정
  const [visible, setVisible] = React.useState(false) // 메뉴노출(비노출)
  const [soldOut, setSoldOut] = React.useState(false) // 품절
  const [optionType, setOptionType] = React.useState('') // 옵션분류
  const [optionName, setOptionName] = React.useState('') // 옵션명
  const [optionPrice, setOptionPrice] = React.useState('') // 옵션가격
  const [optionVisible, setOptionVisible] = React.useState(false) // 옵션노출(비노출)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [menuCategory, setMenuCategory] = React.useState([])
  const [isLoading, setLoading] = React.useState(true)

  const getMenuCategoryHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      mode: 'select'
    }

    Api.send('store_item_category', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        arrItems.map((menu) => {
          setMenuCategory(prev => [
            ...prev,
            {
              label: menu.ca_name,
              value: menu.ca_code
            }
          ])
        })
      } else {
        console.log('메뉴를 가져오지 못했습니다.')
      }
    })
  }

  const getMenuDetailHandler = () => {
    setLoading(true)

    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      it_id: props.route.params.item.it_id
    }

    Api.send('store_item_detail', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      console.log('get Menu resultItem', resultItem)
      console.log('get Menu arrItems', arrItems)

      if (resultItem.result === 'Y') {
        console.log('menu import', arrItems)
        setMenuId(arrItems.it_id)
        setSelectCategory(arrItems.ca_code)
        setName(arrItems.menuName)
        setMenuShortDesc(arrItems.menuInfo)
        setSalePrice(arrItems.menuPrice)
        setDescription(arrItems.menuDescription)
        if (arrItems.it_type1 === '0') {
          setCheckMain(false)
        } else {
          setCheckMain(true)
        }

        if (arrItems.it_use === '0') {
          setVisible(false)
        } else {
          setVisible(true)
        }

        if (arrItems.it_img1) {
          setMenuImage(arrItems.it_img1)
        } else {
          setMenuImage(null)
        }

        // const isEmptyOption = isEmptyObject(arrItems.menuOption)
        // const isEmptyAddOption = isEmptyObject(arrItems.menuAddOption)

        // console.log('isEmptyOption', isEmptyOption)
        // console.log('isEmptyAddOption', isEmptyAddOption)

        setOptions(arrItems.menuOption)
        setAddOptions(arrItems.menuAddOption)
      } else {
        cusToast('메뉴 상세내용을 가져오는 중 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 1500)

        setTimeout(() => {
          navigation.navigate.goBack()
        }, 1500)
      }

      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed && type !== '') {
      getMenuCategoryHandler()

      if (type === 'add') {
        setLoading(false)
      }
      if (type === 'edit') {
        getMenuDetailHandler()
      }
    }

    return () => {
      isSubscribed = false
    }
  }, [type])

  // 모달 토글
  const toggleModal = () => {
    setIsModalVisible(prev => !prev)
  }

  // 메뉴 노출(비노출)
  const toggleCheckMain = () => {
    setCheckMain(prev => !prev)
  }

  // 메뉴 노출(비노출)
  const toggleVisible = () => {
    setVisible(prev => !prev)
  }

  // 메뉴 품절
  const toggleSoldOut = () => {
    setSoldOut(prev => !prev)
  }

  // 옵션 노출(비노출)
  const toggleOptionVisible = () => {
    setOptionVisible(prev => !prev)
  }

  const validateText = val => {
    return val.replace(/[`!@#$%^*():|?<>\{\}\[\]\\\/]/gi, '')
  }

  const createOption = () => {
    return {
      multiple: false,
      name: '',
      select: [
        {
          value: '',
          price: ''
        }
      ]
    }
  }

  const createPrice = () => {
    return { name: '', value: '', price: null }
  }

  // prices
  const [prices, setPrices] = React.useState([createPrice()])
  const handleAddPrice = () => {
    setPrices(price => [...price, createPrice()])
  }
  // end: prices

  // options
  const [options, setOptions] = React.useState([])
  const handleOption = () => {
    if (options.length < 10) {
      setOptions(options => {
        const result = [...options]
        result.push(createOption())
        return result
      })
    } else {
      cusToast('최대 10개 입력하실 수 있습니다.')
    }
  }

  const [addOptions, setAddOptions] = React.useState([])
  const handleAddOption = () => {
    setAddOptions(addOptions => {
      const result = [...addOptions]
      result.push(createOption())
      return result
    })
  }
  // end: options

  // 메뉴 사진 설정
  const [menuImage, setMenuImage] = React.useState(null)
  const [source, setSource] = React.useState({})

  // 이미지 업로드 핸들러
  const pickImageHandler = () => {
    toggleModal()
    pickGalleryImage(setSource, setMenuImage)
  }

  // 카메라 촬영 핸들러
  const openCameraHandler = () => {
    toggleModal()
    takeCamera(setSource, setMenuImage)
  }

  // 빈 오브젝트 체킹
  const isEmptyObject = param => {
    return Object.keys(param).length === 0 && param.constructor === Object
  }

  const isEmptyObj = obj => {
    if (obj.constructor === Object && Object.keys(obj).length === 0) {
      return true
    }
    return false
  }

  // 메뉴 추가 핸들러
  const sendMenuAddHandler = () => {
    const isValidate = checkMenuValidate(selectCategory, name, salePrice)

    if (isValidate) {
      if (type === 'add') {
        const isEmptyImage = isEmptyObject(source)

        const param = {
          jumju_id: mtId,
          jumju_code: mtJumjuCode,
          mode: 'insert',
          ca_id2: selectCategory,
          menuName: name,
          menuInfo: menuShortDesc,
          menuPrice: salePrice,
          menuDescription: description,
          it_type1: checkMain ? '1' : '0',
          it_use: visible,
          menuOption: JSON.stringify(options),
          menuAddOption: JSON.stringify(addOptions),
          it_img1: isEmptyImage ? '' : source
        }

        Api.send2('store_item_input', param, args => {
          const resultItem = args.resultItem
          const arrItems = args.arrItems

          if (resultItem.result === 'Y') {
            cusToast('메뉴가 등록되었습니다.\n관리자 승인 후 리스트에 노출됩니다.', 1000)
          } else {
            cusToast('메뉴를 등록 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 1500)
          }

          setTimeout(() => {
            navigation.navigate('Home', { screen: 'SetMenu' })
          }, 1000)
        })
      }

      if (type === 'edit') {
        const param = {
          jumju_id: mtId,
          jumju_code: mtJumjuCode,
          it_id: menuId,
          mode: 'update',
          ca_id2: selectCategory,
          menuName: name,
          menuInfo: menuShortDesc,
          menuPrice: salePrice,
          menuDescription: description,
          it_type1: checkMain ? '1' : '0',
          it_use: visible ? '1' : '0',
          menuOption: JSON.stringify(options),
          menuAddOption: JSON.stringify(addOptions)
        }

        if (!isEmptyObj(source)) {
          param.it_img1 = source
        }

        Api.send2('store_item_update', param, args => {
          const resultItem = args.resultItem
          const arrItems = args.arrItems

          if (resultItem.result === 'Y') {
            cusToast('메뉴가 수정되었습니다.', 1000)
          } else {
            cusToast('메뉴를 수정 중에 문제가 발생하였습니다.\n관리자에게 문의해주세요.', 1500)
          }

          setTimeout(() => {
            navigation.navigate('Home', { screen: 'SetMenu' })
          }, 1000)
        })
      }
    }
  }

  return (
    <>
      {isLoading && <AnimateLoading description='잠시만 기다려주세요.' />}
      {!isLoading &&
        <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Header navigation={navigation} title={type === 'add' ? '메뉴등록' : '메뉴수정'} />

          {/* 선택 모달 (카메라, 갤러리) */}
          <Modal
            isVisible={isModalVisible}
            onBackdropPress={toggleModal}
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
                onPress={toggleModal}
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
              <Text style={{ ...BaseStyle.ko14 }}>어떤 방식으로 메뉴사진을 올리시겠습니까?</Text>
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt20, ...BaseStyle.ph20 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={pickImageHandler}
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
                  <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>사진촬영</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          {/* // 선택 모달 (카메라, 갤러리) */}

          <ScrollView>
            <View>

              {menuImage && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={toggleModal}
                  style={{
                    ...BaseStyle.bg5,
                    ...BaseStyle.container2,
                    height: 250,
                    position: 'relative'
                  }}
                >
                  <Image
                    source={{ uri: `${menuImage}` }}
                    style={{ width: '100%', height: '100%', ...BaseStyle.mb10 }}
                    resizeMode='cover'
                  />
                  <Image
                    source={require('../images/ico_photo_s.png')}
                    style={{
                      position: 'absolute',
                      bottom: 10,
                      right: 10,
                      width: 40,
                      height: 40,
                      opacity: 0.75,
                      ...BaseStyle.mb10
                    }}
                    resizeMode='contain'
                  />
                </TouchableOpacity>
              )}

              {!menuImage && (
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={toggleModal}
                  style={{
                    ...BaseStyle.bg5,
                    ...BaseStyle.container2,
                    height: 200
                  }}
                >
                  <Image
                    source={require('../images/ico_photo.png')}
                    style={{ width: 50, height: 50, ...BaseStyle.mb10 }}
                    resizeMode='contain'
                  />
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_gray_a1 }}>사진등록</Text>
                </TouchableOpacity>
              )}

              <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
                <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb10 }}>
                  ※ 표시는 필수 입력란 입니다.
                </Text>
                <View style={{ ...BaseStyle.container }}>
                  {/* 분류선택 */}
                  <View style={{ ...BaseStyle.mv10, flex: 1 }}>
                    <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                        분류선택
                      </Text>
                      <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                    </View>

                    {menuCategory && menuCategory.length > 0 && (
                      <Categories selectCategory={selectCategory} setSelectCategory={setSelectCategory} items={menuCategory} />
                    )}

                    {!menuCategory && (
                      <View>
                        <Text
                          style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb5 }}
                        >
                          등록된 카테고리가 없습니다.
                        </Text>
                        <TouchableOpacity
                          activeOpacity={1}
                          style={{ ...BaseStyle.mainBtn }}
                          onPress={() => navigation.navigate('setCategory')}
                        >
                          <Text
                            style={{
                              ...BaseStyle.ko15,
                              ...BaseStyle.font_bold,
                              ...BaseStyle.font_white
                            }}
                          >
                            카테고리 등록하기
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                  {/* // 분류선택 */}
                </View>

                {/* 메뉴명 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      메뉴명
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
                      value={name}
                      placeholder='메뉴명을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.inputH,
                        ...BaseStyle.ko14,
                        marginTop: 10
                      }}
                      onChangeText={text => setName(text)}
                      autoCapitalize='none'
                    />
                  </View>
                </View>
                {/* // 메뉴명 */}

                {/* 대표메뉴 설정 유무 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <View style={{ ...BaseStyle.container }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      대표메뉴 ?
                    </Text>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={toggleCheckMain}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container }}
                    >
                      <Image
                        source={
                      checkMain
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      {checkMain ? (
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                          대표메뉴로 지정하셨습니다.
                        </Text>
                      ) : (
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                          현재 상태는 일반 메뉴 상태입니다.
                        </Text>
                      )}
                    </TouchableOpacity>
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
                      대표메뉴로 체크하시면 메뉴 노출시 대표메뉴에 포함됩니다.
                    </Text>
                  </View>
                </View>
                {/* // 대표메뉴 설정 유무 */}

                {/* 기본설명 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    기본설명
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
                      value={menuShortDesc}
                      placeholder='기본설명을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.inputH,
                        ...BaseStyle.ko14,
                        marginTop: 10
                      }}
                      onChangeText={text => setMenuShortDesc(text)}
                      autoCapitalize='none'
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
                      메뉴명 하단에 상품에 대한 추가적인 설명이 필요한 경우에 입력합니다.
                    </Text>
                  </View>
                </View>
                {/* // 기본설명 */}

                {/* 판매가격 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      판매가격
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
                      value={salePrice}
                      placeholder='0'
                      style={{
                        width: '95%',
                        ...BaseStyle.inputH,
                        textAlign: 'right',
                        ...BaseStyle.ko15,
                        marginTop: 10
                      }}
                      onChangeText={text => {
                        const re = /^[0-9\b]+$/
                        if (text === '' || re.test(text)) {
                          const changed = text.replace(/(^0+)/, '')
                          setSalePrice(changed)
                        } else {
                          setSalePrice('0')
                        }
                      }}
                      keyboardType='number-pad'
                      autoCapitalize='none'
                    />
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
                  </View>
                </View>
                {/* // 판매가격 */}

                {/* 메뉴 상세 설명 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                    메뉴 상세 설명
                  </Text>
                  {/* <View style={{...BaseStyle.container3, ...BaseStyle.mb10}}>
                <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5}}>
                  메뉴 상세 설명
                </Text>
                <Text style={{...BaseStyle.ko12, color: Primary.PointColor02}}>※</Text>
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
                      value={description}
                      placeholder='메뉴에 대한 설명을 입력해주세요.'
                      style={{
                        width: '100%',
                        ...BaseStyle.ko14,
                        ...BaseStyle.lh22,
                        marginTop: 10
                      }}
                      onChangeText={text => setDescription(text)}
                      autoCapitalize='none'
                      multiline
                    />
                  </View>
                </View>
                {/* // 메뉴 상세 설명 */}

                {/* 판매가능 */}
                <View style={{ ...BaseStyle.mv10 }}>
                  <View style={{ ...BaseStyle.container }}>
                    <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                      판매가능 ?
                    </Text>
                    <TouchableOpacity
                      activeOpacity={1}
                      onPress={toggleVisible}
                      hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                      style={{ ...BaseStyle.container }}
                    >
                      <Image
                        source={
                      visible
                        ? require('../images/ic_check_on.png')
                        : require('../images/ic_check_off.png')
                    }
                        style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                        resizeMode='contain'
                        fadeDuration={100}
                      />
                      {visible ? (
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                          판매 가능한 상품으로 지정하셨습니다.
                        </Text>
                      ) : (
                        <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                          판매 메뉴에 노출되지 않습니다.
                        </Text>
                      )}
                    </TouchableOpacity>
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
                      잠시 판매를 중단하거나 재고가 없을 경우에 체크를 해제해 놓으면 출력되지 않으며,
                      주문도 받지 않습니다.
                    </Text>
                  </View>
                </View>
                {/* // 판매가능 */}

                <View style={styles.section}>
                  {options?.map((option, index) => (
                    <React.Fragment key={String(index)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 10
                        }}
                      >
                        <Text
                          style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222 }}
                        >
                          기본옵션{index + 1}
                        </Text>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_777,
                            height: 30,
                            fontSize: 14,
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            borderColor: Primary.PointColor01,
                            borderWidth: 1.5,
                            borderRadius: 4
                          }}
                          onPress={() => {
                            setOptions(options => {
                              const result = [...options]
                              result.splice(index, 1)
                              return result
                            })
                          }}
                        >
                          - 옵션삭제
                        </Text>
                      </View>
                      {option.select.map((item, selectIndex) => (
                        <View
                          key={String(selectIndex)}
                          style={{ marginTop: selectIndex === 0 ? 10 : 0 }}
                        >
                          {selectIndex === 0 ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                ...BaseStyle.mb5
                              }}
                            >
                              <TextInput
                                style={{
                                  ...BaseStyle.inputH,
                                  ...BaseStyle.ph10,
                                  ...BaseStyle.border,
                                  flex: 3,
                                  ...BaseStyle.mr5
                                }}
                                placeholder='옵션구분 예) 맛 선택'
                                placeholderTextColor='#a2a2a2'
                                keyboardType='default'
                                onChangeText={val =>
                                  setOptions(options => {
                                    const result = [...options]
                                    result[index].name = validateText(val)
                                    return result
                                  })}
                                value={option.name}
                              />
                              <Text
                                style={{
                                  flex: 1,
                                  ...BaseStyle.ko15,
                                  ...BaseStyle.font_666,
                                  width: 30,
                                  height: 50,
                                  fontSize: 13,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                  borderColor: '#ececec',
                                  borderWidth: 1.5,
                                  borderRadius: 4
                                }}
                                onPress={() => {
                                  setOptions(options => {
                                    const result = [...options]
                                    result[index].select.push({
                                      value: '',
                                      price: ''
                                    })
                                    return result
                                  })
                                }}
                              >
                                세부추가
                              </Text>
                            </View>
                          ) : null}
                          <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              style={{
                                ...BaseStyle.inputH,
                                ...BaseStyle.ph10,
                                ...BaseStyle.border,
                                ...BaseStyle.mb5,
                                flex: 1
                              }}
                              placeholder='옵션 예) 매운맛'
                              placeholderTextColor='#a2a2a2'
                              keyboardType='default'
                              onChangeText={val =>
                                setOptions(options => {
                                  const result = [...options]
                                  result[index].select[selectIndex].value = validateText(val)
                                  return result
                                })}
                              value={item.value}
                            />
                            <TextInput
                              style={{
                                ...BaseStyle.inputH,
                                ...BaseStyle.ph10,
                                ...BaseStyle.border,
                                ...BaseStyle.mb5,
                                marginLeft: 6,
                                width: 100
                              }}
                              placeholder='금액'
                              placeholderTextColor='#a2a2a2'
                              keyboardType='numeric'
                              returnKeyType='done'
                              onChangeText={val =>
                                setOptions(options => {
                                  const result = [...options]
                                  result[index].select[selectIndex].price = validateText(val)
                                  return result
                                })}
                              value={item.price + ''}
                            />
                            <Text style={{ marginLeft: 4, ...BaseStyle.ko15, ...BaseStyle.font_222 }}>
                              원
                            </Text>
                            <TouchableWithoutFeedback
                              onPress={() => {
                                setOptions(options => {
                                  const result = [...options]
                                  result[index].select.splice(selectIndex, 1)
                                  return result
                                })
                              }}
                            >
                              <Image
                                style={{
                                  marginLeft: 8,
                                  width: 20,
                                  height: 20,
                                  opacity: 0.2,
                                  resizeMode: 'cover'
                                }}
                                source={require('../images/popup_close.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      ))}
                    </React.Fragment>
                  ))}

                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{ ...BaseStyle.mainBorderBtn }}
                      onPress={handleOption}
                    >
                      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>기본옵션 추가 +</Text>
                    </TouchableOpacity>
                  </View>

                  {addOptions?.map((option, index) => (
                    <React.Fragment key={String(index)}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          marginTop: 20
                        }}
                      >
                        <Text
                          style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.font_222 }}
                        >
                          추가옵션{index + 1}
                        </Text>
                        <Text
                          style={{
                            ...BaseStyle.ko15,
                            ...BaseStyle.font_777,
                            height: 30,
                            fontSize: 14,
                            paddingHorizontal: 10,
                            textAlign: 'center',
                            textAlignVertical: 'center',
                            borderColor: Primary.PointColor02,
                            borderWidth: 1.5,
                            borderRadius: 4
                          }}
                          onPress={() => {
                            setAddOptions(options => {
                              const result = [...options]
                              result.splice(index, 1)
                              return result
                            })
                          }}
                        >
                          - 옵션삭제
                        </Text>
                      </View>
                      {option.select.map((item, selectIndex) => (
                        <View
                          key={String(selectIndex)}
                          style={{ marginTop: selectIndex === 0 ? 10 : 0 }}
                        >
                          {selectIndex === 0 ? (
                            <View
                              style={{
                                flexDirection: 'row',
                                justifyContent: 'flex-start',
                                alignItems: 'center',
                                ...BaseStyle.mb5
                              }}
                            >
                              <TextInput
                                style={{
                                  ...BaseStyle.inputH,
                                  ...BaseStyle.ph10,
                                  ...BaseStyle.border,
                                  flex: 3,
                                  ...BaseStyle.mr5
                                }}
                                placeholder='옵션구분 예) 음료'
                                placeholderTextColor='#a2a2a2'
                                keyboardType='default'
                                onChangeText={val =>
                                  setAddOptions(addOptions => {
                                    const result = [...addOptions]
                                    result[index].name = validateText(val)
                                    return result
                                  })}
                                value={option.name}
                              />
                              <Text
                                style={{
                                  flex: 1,
                                  ...BaseStyle.ko15,
                                  ...BaseStyle.font_666,
                                  width: 30,
                                  height: 50,
                                  fontSize: 13,
                                  textAlign: 'center',
                                  textAlignVertical: 'center',
                                  borderColor: '#ececec',
                                  borderWidth: 1.5,
                                  borderRadius: 4
                                }}
                                onPress={() => {
                                  setAddOptions(addOptions => {
                                    const result = [...addOptions]
                                    result[index].select.push({
                                      value: '',
                                      price: ''
                                    })
                                    return result
                                  })
                                }}
                              >
                                세부추가
                              </Text>
                            </View>
                          ) : null}
                          <View style={{ marginTop: 6, flexDirection: 'row', alignItems: 'center' }}>
                            <TextInput
                              style={{
                                ...BaseStyle.inputH,
                                ...BaseStyle.ph10,
                                ...BaseStyle.border,
                                ...BaseStyle.mb5,
                                flex: 1
                              }}
                              placeholder='옵션 예) 콜라1.5L'
                              placeholderTextColor='#a2a2a2'
                              keyboardType='default'
                              onChangeText={val =>
                                setAddOptions(addOptions => {
                                  const result = [...addOptions]
                                  result[index].select[selectIndex].value = validateText(val)
                                  return result
                                })}
                              value={item.value}
                            />
                            <TextInput
                              style={{
                                ...BaseStyle.inputH,
                                ...BaseStyle.ph10,
                                ...BaseStyle.border,
                                ...BaseStyle.mb5,
                                marginLeft: 6,
                                width: 100
                              }}
                              placeholder='금액'
                              placeholderTextColor='#a2a2a2'
                              keyboardType='numeric'
                              returnKeyType='done'
                              onChangeText={val =>
                                setAddOptions(addOptions => {
                                  const result = [...addOptions]
                                  result[index].select[selectIndex].price = validateText(val)
                                  return result
                                })}
                              value={item.price + ''}
                            />
                            <Text style={{ marginLeft: 4, ...BaseStyle.ko15, ...BaseStyle.font_222 }}>
                              원
                            </Text>
                            <TouchableWithoutFeedback
                              onPress={() => {
                                setAddOptions(addOptions => {
                                  const result = [...addOptions]
                                  result[index].select.splice(selectIndex, 1)
                                  return result
                                })
                              }}
                            >
                              <Image
                                style={{
                                  marginLeft: 8,
                                  width: 20,
                                  height: 20,
                                  opacity: 0.2,
                                  resizeMode: 'cover'
                                }}
                                source={require('../images/popup_close.png')}
                              />
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      ))}
                    </React.Fragment>
                  ))}

                  <View style={{ marginTop: 10 }}>
                    <TouchableOpacity
                      activeOpacity={1}
                      style={{ ...BaseStyle.mintBorderBtn }}
                      onPress={handleAddOption}
                    >
                      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>추가옵션 추가 +</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {/* // 옵션 */}
              </View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={sendMenuAddHandler}
                style={{ ...BaseStyle.mainBtnBottom }}
              >
                <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
                  {type === 'add' ? '등록하기' : '수정하기'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>}
    </>
  )
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 25
  },
  sectionLabel: {
    fontSize: 15,
    color: Primary.PointColor01
  },
  photoOutlinedButton: {
    borderColor: Primary.PointColor01,
    borderWidth: 1,
    backgroundColor: 'white',
    paddingVertical: 5,
    paddingHorizontal: 13
  },
  photoOutlinedButtonText: {
    fontSize: 14,
    color: Primary.PointColor01
  },
  outlinedButton: {
    height: 42,
    borderColor: Primary.PointColor01,
    borderWidth: 1,
    backgroundColor: 'white'
  },
  outlinedButtonText: {
    color: Primary.PointColor01
  }
})

export default SetMenuAddOrEdit
