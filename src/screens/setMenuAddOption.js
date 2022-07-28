import * as React from "react"
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  ScrollView,
} from "react-native"
import RNPickerSelect from "react-native-picker-select" // 셀렉트박스 패키지
import ImagePicker from "react-native-image-crop-picker" // 이미지 업로드 패키지
import Header from "../components/SubHeader"
import BaseStyle, { Primary, customPickerStyles } from "../styles/Base"
import { defaultType, secondType, options } from "../data/menu"

const { width, height } = Dimensions.get("window")

const SetMenuAddOption = props => {
  const { navigation } = props

  const [selectDefault, setSelectDefault] = React.useState("") // 기본분류
  const [selectSecond, setSelectSecond] = React.useState("") // 2차분류
  const [name, setName] = React.useState("") // 상품명
  const [menuShortDesc, setMenuShortDesc] = React.useState("") // 기본설명
  const [salePrice, setSalePrice] = React.useState("") // 판매가격
  const [description, setDescription] = React.useState("") // 메뉴 상세설명
  const [visible, setVisible] = React.useState(false) // 메뉴노출(비노출)
  const [soldOut, setSoldOut] = React.useState(false) // 품절
  const [optionType, setOptionType] = React.useState("") // 옵션분류
  const [optionName, setOptionName] = React.useState("") // 옵션명
  const [optionPrice, setOptionPrice] = React.useState("") // 옵션가격
  const [optionVisible, setOptionVisible] = React.useState(false) // 옵션노출(비노출)

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

  // 메뉴 사진 설정
  const [menuImage, setMenuImage] = React.useState(null)
  const [source, setSource] = React.useState({})

  const pickImageHandler = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      sortOrder: "none",
      compressImageMaxWidth: 5000,
      compressImageMaxHeight: 5000,
      compressImageQuality: 1,
      compressVideoPreset: "MediumQuality",
      includeExif: true,
      cropperCircleOverlay: false,
      useFrontCamera: false,
      // includeBase64: true,
      cropping: false,
    })
      .then(img => {
        // dispatch(UserProfileImg(img.path));
        setSource({
          uri: img.path,
          type: img.mime,
          name: img.path.slice(img.path.lastIndexOf("/")),
        })
        setMenuImage(img.path)
      })
      .catch(e => console.log(e))
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header navigation={navigation} title="옵션분류관리" />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      <ScrollView>
        <View>
          {menuImage ? (
            <TouchableOpacity
              activeOpacity={1}
              onPress={pickImageHandler}
              style={{
                ...BaseStyle.bg5,
                ...BaseStyle.container2,
                height: 250,
                position: "relative",
              }}
            >
              <Image
                source={{ uri: `${menuImage}` }}
                style={{ width: "100%", height: "100%", ...BaseStyle.mb10 }}
                resizeMode="cover"
              />
              <Image
                source={require("../images/ico_photo_s.png")}
                style={{
                  position: "absolute",
                  bottom: 10,
                  right: 10,
                  width: 40,
                  height: 40,
                  opacity: 0.75,
                  ...BaseStyle.mb10,
                }}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={pickImageHandler}
              style={{
                ...BaseStyle.bg5,
                ...BaseStyle.container2,
                height: 200,
              }}
            >
              <Image
                source={require("../images/ico_photo.png")}
                style={{ width: 50, height: 50, ...BaseStyle.mb10 }}
                resizeMode="contain"
              />
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_gray_a1 }}>사진등록</Text>
            </TouchableOpacity>
          )}

          <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
            <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02, ...BaseStyle.mb10 }}>
              ※ 표시는 필수 입력란 입니다.
            </Text>
            <View style={{ ...BaseStyle.container }}>
              {/* 기본분류 */}
              <View style={{ ...BaseStyle.mv10, flex: 1, ...BaseStyle.mr5 }}>
                <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                    기본분류
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                </View>
                <RNPickerSelect
                  fixAndroidTouchableBug={true}
                  value={selectDefault}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "선택해주세요.", value: null }}
                  onValueChange={value => setSelectDefault(value)}
                  items={defaultType}
                  style={{
                    ...customPickerStyles,
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    ...BaseStyle.round05,
                    ...BaseStyle.inputH,
                    placeholder: {
                      color: "#888",
                    },
                  }}
                  Icon={() => {
                    return (
                      <Image
                        source={require("../images/ic_select.png")}
                        style={{ width: 50, height: 50 }}
                        resizeMode="center"
                      />
                    )
                  }}
                />
              </View>
              {/* // 기본분류 */}

              {/* 2차분류 */}
              <View style={{ ...BaseStyle.mv10, flex: 1, ...BaseStyle.ml5 }}>
                <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                    2차분류
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
                </View>
                <RNPickerSelect
                  fixAndroidTouchableBug={true}
                  value={selectSecond}
                  useNativeAndroidPickerStyle={false}
                  placeholder={{ label: "선택해주세요.", value: null }}
                  onValueChange={value => setSelectSecond(value)}
                  items={secondType}
                  style={{
                    ...customPickerStyles,
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    ...BaseStyle.round05,
                    ...BaseStyle.inputH,
                    placeholder: {
                      color: "#888",
                    },
                  }}
                  Icon={() => {
                    return (
                      <Image
                        source={require("../images/ic_select.png")}
                        style={{ width: 50, height: 50 }}
                        resizeMode="center"
                      />
                    )
                  }}
                />
              </View>
              {/* // 2차분류 */}
            </View>

            {/* 상품명 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                  상품명
                </Text>
                <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
              </View>
              <View
                style={{
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}
              >
                <TextInput
                  value={name}
                  placeholder="상품명을 입력해주세요."
                  style={{
                    width: "100%",
                    ...BaseStyle.inputH,
                    ...BaseStyle.ko14,
                    marginTop: 10,
                  }}
                  onChangeText={text => setName(text)}
                  autoCapitalize="none"
                />
              </View>
            </View>
            {/* // 상품명 */}

            {/* 기본설명 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
                기본설명
              </Text>
              <View
                style={{
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}
              >
                <TextInput
                  value={menuShortDesc}
                  placeholder="기본설명을 입력해주세요."
                  style={{
                    width: "100%",
                    ...BaseStyle.inputH,
                    ...BaseStyle.ko14,
                    marginTop: 10,
                  }}
                  onChangeText={text => setMenuShortDesc(text)}
                  autoCapitalize="none"
                />
              </View>
              <View style={{ ...BaseStyle.container3, ...BaseStyle.mt5 }}>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    ...BaseStyle.lh17,
                    color: Primary.PointColor02,
                    ...BaseStyle.mr5,
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
                    flexWrap: "wrap",
                  }}
                >
                  상품명 하단에 상품에 대한 추가적인 설명이 필요한 경우에 입력합니다.
                </Text>
              </View>
            </View>
            {/* // 기본설명 */}

            {/* 출력순서 */}
            {/* <View style={{...BaseStyle.mv10}}>
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              출력순서
              </Text>
              <View
                style={{
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}>
                <TextInput
                  value={menuShortDesc}
                  placeholder="출력순서을 입력해주세요."
                  style={{
                    width: '100%',
                    ...BaseStyle.inputH,
                    ...BaseStyle.ko14,
                    marginTop:10
                  }}
                  onChangeText={text => setMenuShortDesc(text)}
                  autoCapitalize="none"
                />
              </View>
              <View style={{...BaseStyle.container3, ...BaseStyle.mt5}}>
                <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17, color:Primary.PointColor02, ...BaseStyle.mr5}}>※</Text>
                <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17, color:Primary.PointColor02, flex:1, flexWrap:'wrap'}}>
                  {'음수 입력도 가능하며 숫자가 작을 수록 상위에 출력됩니다.\n입력하지 않으면 자동으로 출력됩니다.'}
                </Text>
              </View>
            </View> */}
            {/* // 출력순서 */}

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
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}
              >
                <TextInput
                  value={salePrice}
                  placeholder="0"
                  style={{
                    width: "95%",
                    ...BaseStyle.inputH,
                    textAlign: "right",
                    ...BaseStyle.ko15,
                    marginTop: 10,
                  }}
                  onChangeText={text => {
                    const filteredText = text.replace(/(-)|(\.)/gi, "")

                    if (filteredText !== null || filteredText !== "") {
                      setSalePrice(filteredText)
                    } else {
                      setSalePrice("0")
                    }
                  }}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
              </View>
            </View>
            {/* // 판매가격 */}

            {/* 메뉴 상세 설명 */}
            <View style={{ ...BaseStyle.mv10 }}>
              {/* <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              메뉴 상세 설명
              </Text> */}
              <View style={{ ...BaseStyle.container3, ...BaseStyle.mb10 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                  메뉴 상세 설명
                </Text>
                <Text style={{ ...BaseStyle.ko12, color: Primary.PointColor02 }}>※</Text>
              </View>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.ph10,
                  height: 150,
                }}
              >
                <TextInput
                  value={description}
                  placeholder="메뉴에 대한 설명을 입력해주세요."
                  style={{
                    width: "100%",
                    ...BaseStyle.ko14,
                    ...BaseStyle.lh22,
                    marginTop: 10,
                  }}
                  onChangeText={text => setDescription(text)}
                  autoCapitalize="none"
                  multiline
                />
              </View>
            </View>
            {/* // 메뉴 상세 설명 */}

            {/* 판매가능 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <View style={{ ...BaseStyle.container }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mr5 }}>
                  판매가능
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
                        ? require("../images/ic_check_on.png")
                        : require("../images/ic_check_off.png")
                    }
                    style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  {visible ? (
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                      판매 가능한 상품으로 지정하셨습니다.
                    </Text>
                  ) : (
                    <Text style={{ ...BaseStyle.ko14, ...BaseStyle.lh20, marginTop: 1 }}>
                      현재 상태에서는 판매 메뉴에 노출되지 않습니다.
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
                    ...BaseStyle.mr5,
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
                    flexWrap: "wrap",
                  }}
                >
                  잠시 판매를 중단하거나 재고가 없을 경우에 체크를 해제해 놓으면 출력되지 않으며,
                  주문도 받지 않습니다.
                </Text>
              </View>

              {/* 판매가능, 품절 */}
              {/* <View style={{...BaseStyle.container, alignSelf:'flex-end', ...BaseStyle.mv10}}>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={toggleVisible}
                  hitSlop={{top:10, right:10, bottom:10, left:10}}
                  style={{...BaseStyle.container}}
                >
                  <Image 
                    source={visible ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')} 
                    style={{width:20, height:20, ...BaseStyle.mr5}} 
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>판매가능</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  activeOpacity={1}
                  onPress={toggleSoldOut}
                  hitSlop={{top:10, right:10, bottom:10, left:10}}
                  style={{...BaseStyle.container, ...BaseStyle.mr10}}
                >
                  <Image 
                    source={soldOut ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')} 
                    style={{width:20, height:20, ...BaseStyle.mr5}} 
                    resizeMode="contain"
                    fadeDuration={100}
                  />
                  <Text style={{...BaseStyle.ko14}}>품절</Text>
                </TouchableOpacity>
              </View> */}
              {/* 판매가능, 품절 */}
            </View>
            {/* // 판매가능 */}

            {/* 옵션 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
                옵션
              </Text>
              <View style={{ ...BaseStyle.container }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    ...BaseStyle.mainBtn,
                    ...BaseStyle.mr5,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_333 }}>옵션 분류 관리</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    ...BaseStyle.mainBtn,
                    ...BaseStyle.ml5,
                    backgroundColor: Primary.PointColor02,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_white }}>옵션 추가 +</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{ height: 1, width: "100%", backgroundColor: "#E3E3E3", ...BaseStyle.mv10 }}
            />
            {/* 옵션분류 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>옵션 분류</Text>
              <RNPickerSelect
                fixAndroidTouchableBug={true}
                value={optionType}
                useNativeAndroidPickerStyle={false}
                placeholder={{ label: "옵션분류", value: null }}
                onValueChange={value => setOptionType(value)}
                items={options}
                style={{
                  ...customPickerStyles,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  placeholder: {
                    color: "#888",
                  },
                }}
                Icon={() => {
                  return (
                    <Image
                      source={require("../images/ic_select.png")}
                      style={{ width: 50, height: 50 }}
                      resizeMode="center"
                    />
                  )
                }}
              />
            </View>
            {/* //옵션분류 */}

            {/* 옵션명 */}
            <View style={{ ...BaseStyle.mv10 }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>옵션명</Text>
              <View
                style={{
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}
              >
                <TextInput
                  value={optionName}
                  placeholder="옵션명을 입력해주세요."
                  style={{
                    width: "100%",
                    ...BaseStyle.inputH,
                    ...BaseStyle.ko14,
                    marginTop: 10,
                  }}
                  onChangeText={text => setOptionName(text)}
                  autoCapitalize="none"
                />
              </View>
            </View>
            {/* //옵션명 */}

            {/* 옵션 가격 */}
            <View style={{ ...BaseStyle.mt10 }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5 }}>옵션 가격</Text>
              <View
                style={{
                  ...BaseStyle.container5,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                  ...BaseStyle.inputH,
                  ...BaseStyle.ph10,
                }}
              >
                <TextInput
                  value={optionPrice}
                  placeholder="0"
                  style={{
                    width: "95%",
                    ...BaseStyle.inputH,
                    textAlign: "right",
                  }}
                  onChangeText={text => {
                    const filteredText = text.replace(/(-)|(\.)/gi, "")

                    if (filteredText !== null || filteredText !== "") {
                      setOptionPrice(filteredText)
                    } else {
                      setOptionPrice("0")
                    }
                  }}
                  keyboardType="number-pad"
                  autoCapitalize="none"
                />
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>원</Text>
              </View>
            </View>
            {/* // 옵션 가격 */}

            {/* 비노출, 비포장 */}
            <View style={{ ...BaseStyle.container, alignSelf: "flex-end", ...BaseStyle.mv10 }}>
              {/* <TouchableOpacity
                activeOpacity={1}
                onPress={toggleVisible}
                hitSlop={{top:10, right:10, bottom:10, left:10}}
                style={{...BaseStyle.container, ...BaseStyle.mr20}}
              >
                <Image 
                  source={visible ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')} 
                  style={{width:20, height:20, ...BaseStyle.mr5}} 
                  resizeMode="contain"
                  fadeDuration={100}
                />
                <Text style={{...BaseStyle.ko14}}>비포장</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                activeOpacity={1}
                onPress={toggleOptionVisible}
                hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
                style={{ ...BaseStyle.container, ...BaseStyle.mr10 }}
              >
                <Image
                  source={
                    optionVisible
                      ? require("../images/ic_check_on.png")
                      : require("../images/ic_check_off.png")
                  }
                  style={{ width: 20, height: 20, ...BaseStyle.mr5 }}
                  resizeMode="contain"
                  fadeDuration={100}
                />
                <Text style={{ ...BaseStyle.ko14 }}>비노출</Text>
              </TouchableOpacity>
            </View>
            {/* 비노출, 비포장 */}

            {/* // 옵션 */}
          </View>
        </View>
      </ScrollView>
    </View>
  )
}

export default SetMenuAddOption
