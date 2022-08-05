import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert
} from 'react-native'
import RNPickerSelect from 'react-native-picker-select' // 셀렉트박스 패키지
import ImagePicker from 'react-native-image-crop-picker' // 이미지 업로드 패키지
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import Header from '../components/SubHeader'
import BaseStyle, { Primary, customPickerStyles } from '../styles/Base'
import { defaultType, secondType } from '../data/menu'
import cusToast from '../components/CusToast'
import Api from '../Api'

const { width, height } = Dimensions.get('window')

const setCategory = props => {
  const { navigation } = props

  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const [selectDefault, setSelectDefault] = React.useState('') // 기본분류
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

  const getMenuCategoryHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    }

    Api.send('store_item_category', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        arrItems.map(menu => {
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

  React.useEffect(() => {
    getMenuCategoryHandler()

    return () => getMenuCategoryHandler()
  }, [])

  // 모달 토글
  const toggleModal = () => setIsModalVisible(prev => !prev)

  // 메뉴 노출(비노출)
  const toggleCheckMain = () => setCheckMain(prev => !prev)

  // 메뉴 노출(비노출)
  const toggleVisible = () => setVisible(prev => !prev)

  // 메뉴 품절
  const toggleSoldOut = () => setSoldOut(prev => !prev)

  // 옵션 노출(비노출)
  const toggleOptionVisible = () => setOptionVisible(prev => !prev)

  const validateText = val => val.replace(/[`!@#$%^*():|?<>\{\}\[\]\\\/]/gi, '')

  const createOption = () => {
    return [
      {
        label: '',
        value: '',
        visible: ''
      }
    ]
  }

  const createPrice = () => {
    return [{ name: '', value: '', price: null }]
  }

  // prices
  const [prices, setPrices] = React.useState([createPrice()])
  const handleAddPrice = () => setPrices(price => [...price, createPrice()])
  // end: prices

  // options
  const [options, setOptions] = React.useState([])
  const handleOption = () => {
    if (options.length < 3) {
      setOptions(options => {
        const result = [...options]
        result.push(createOption())
        return result
      })
    } else {
      cusToast('최대 3개 입력하실 수 있습니다.')
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

  console.log('====================================')
  console.log('options ?? ', options)
  console.log('====================================')

  // 활성, 비활성 구분
  const [isVisible, setIsVisible] = React.useState(1)
  const isVisibleArr = [
    {
      label: '활성',
      value: 1
    },
    {
      label: '비활성',
      value: 0
    }
  ]

  // 메뉴 사진 설정
  const [menuImage, setMenuImage] = React.useState(null)
  const [source, setSource] = React.useState({})

  // 메뉴 추가 핸들러
  const sendMenuAddHandler = () => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
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
      it_img1: source
    }

    Api.send2('store_item_input', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        Alert.alert('메뉴가 등록되었습니다.', '관리자 승인 후 리스트에 노출됩니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home', { screen: 'SetMenu' })
          }
        ])
      } else {
        Alert.alert('오류가 발생하였습니다.', '메뉴 리스트로 이동합니다.', [
          {
            text: '확인',
            onPress: () => navigation.navigate('Home', { screen: 'SetMenu' })
          }
        ])
        // setButtonDisabled(false);
      }
    })
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='카테고리 관리' />
      <ScrollView>
        <View>
          <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv20 }}>
            {/* <Text style={{...BaseStyle.ko12, color:Primary.PointColor02, ...BaseStyle.mb10}}>※ 표시는 필수 입력란 입니다.</Text> */}

            {/* 옵션 */}
            <View style={styles.section}>
              {options.map((option, index) => (
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
                      카테고리{index + 1}
                    </Text>
                    {/* <Text
                    style={{ ...BaseStyle.ko15, ...BaseStyle.font_777, width: 30, height: 30, fontSize: 22, textAlign: 'center', textAlignVertical: 'center', borderColor: Primary.PointColor01, borderWidth: 1.5, borderRadius: 4 }}
                    onPress={() => {
                      setOptions(options => {
                        const result = [...options];
                        result[index].select.push({
                          value: '', price: '',
                        });
                        return result;
                      });
                    }}
                  >+</Text> */}
                  </View>
                  {option.map((item, selectIndex) => (
                    <View
                      key={String(selectIndex)}
                      style={{ marginTop: selectIndex === 0 ? 10 : 0 }}
                    >
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center', ...BaseStyle.mb5 }}
                      >
                        <TextInput
                          style={{
                            ...BaseStyle.inputH,
                            ...BaseStyle.ph10,
                            ...BaseStyle.border,
                            ...BaseStyle.mr5,
                            flex: 1
                          }}
                          placeholder='예) 밥류 or 세트류 등'
                          placeholderTextColor='#a2a2a2'
                          keyboardType='default'
                          onChangeText={val =>
                            setOptions(options => {
                              const result = [...options]
                              result[index][selectIndex].label = validateText(val)
                              return result
                            })}
                          value={item.label}
                        />
                        <View style={{ marginRight: 5, width: 100 }}>
                          <RNPickerSelect
                            fixAndroidTouchableBug
                            value={item.visible}
                            useNativeAndroidPickerStyle={false}
                            placeholder={{ label: '선택', value: null }}
                            onValueChange={
                              // (value) => setIsVisible(value);
                              val =>
                                setOptions(options => {
                                  const result = [...options]
                                  result[index][selectIndex].visible = val
                                  return result
                                })
                            }
                            items={isVisibleArr}
                            style={{
                              ...customPickerStyles,
                              justifyContent: 'center',
                              alignItems: 'flex-start',
                              ...BaseStyle.border,
                              ...BaseStyle.inputH,
                              backgroundColor: '#fff',
                              ...BaseStyle.pl20,
                              placeholder: {
                                color: '#888'
                              }
                            }}
                            Icon={() => {
                              return (
                                <Image
                                  source={require('../images/ic_select.png')}
                                  style={{ width: 50, height: 50 }}
                                  resizeMode='center'
                                />
                              )
                            }}
                          />
                        </View>
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

              <View style={{ marginTop: 30 }}>
                <TouchableOpacity
                  activeOpacity={1}
                  style={{ ...BaseStyle.mainBorderBtn }}
                  onPress={handleOption}
                  // onPress={() => {
                  //   setOptions(options => {
                  //     const result = [...options];
                  //     result[index].select.push({
                  //       value: '', price: '',
                  //     });
                  //     return result;
                  //   });
                  // }}
                >
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>카테고리 추가 +</Text>
                </TouchableOpacity>
              </View>
            </View>
            {/* // 옵션 */}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={sendMenuAddHandler}
        style={{ ...BaseStyle.mainBtnBottom }}
      >
        <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold }}>등록하기</Text>
      </TouchableOpacity>
    </View>
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

export default setCategory
