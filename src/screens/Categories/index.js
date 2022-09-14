import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableWithoutFeedback,
  Alert,
  BackHandler,
  Platform
} from 'react-native'
import { useSelector } from 'react-redux'
import Modal from 'react-native-modal'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Disable, Primary } from '../../styles/Base'

import cusToast from '../../components/CusToast'
import Api from '../../Api'
import AnimateLoading from '../../components/Loading/AnimateLoading'

const CategoriesSetting = props => {
  const { navigation } = props

  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)
  const [isModalVisible, setIsModalVisible] = React.useState(false)
  const [refleshing, setReflashing] = React.useState(false)
  const [isLoading, setLoading] = React.useState(true)

  const [menuCategory, setMenuCategory] = React.useState([]) // 카테고리 리스트
  const [currentMenuCategory, setCurrentMenuCategory] = React.useState([]) // 현재 카테고리 리스트
  const [newCategory, setNewCategory] = React.useState('') // 신규 카테고리 명
  const [newCategoryVisible, setNewCategoryVisible] = React.useState(false) // 신규 카테고리 등록(모달) 카테고리 사용여부

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  // 카테고리 배열 생성 
  const newArrayHandler = () => {
    const result = [...currentMenuCategory]
    return result
  }

  // 카테고리명 변경 핸들러
  const changeCategoryName = (val, index) => {
    const result = newArrayHandler()
    result[index].ca_name = val

    checkChangeCategoryItem(result, index)
  }

  // 사용 | 미사용 핸들러
  const insertCurrentCategory = (item, index) => {
    const result = newArrayHandler()
    result[index].ca_use = item.ca_use === '1' ? '0' : '1'

    checkChangeCategoryItem(result, index)
  }

  // 카테고리명 or 카테고리 사용,미사용 수정 체크
  const checkChangeCategoryItem = (item, index) => {
    if (menuCategory[index].ca_use !== item[index].ca_use || menuCategory[index].ca_name !== item[index].ca_name) {
      item[index].isChange = true
    }

    if (menuCategory[index].ca_use === item[index].ca_use && menuCategory[index].ca_name === item[index].ca_name) {
      item[index].isChange = false
    }

    setCurrentMenuCategory(item)
  }

  const toggleCateVisible = () => {
    setNewCategoryVisible(prev => !prev)
  }

  // 카테고리 리스트 호출
  const getMenuCategoryHandler = () => {
    setLoading(true)
    setMenuCategory([])
    setCurrentMenuCategory([])

    const param = {
      jumju_id: mtId,
      jumju_code: mtJumjuCode
    }

    Api.send('store_item_category', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        arrItems.map(item => {
          setMenuCategory(prev => [
            ...prev,
            {
              ca_id: item.ca_id,
              ca_name: item.ca_name,
              ca_use: item.ca_use,
              isChange: false
            }
          ])
        })
        arrItems.map(item => {
          setCurrentMenuCategory(prev => [
            ...prev,
            {
              ca_id: item.ca_id,
              ca_name: item.ca_name,
              ca_use: item.ca_use,
              isChange: false
            }
          ])
        })
        setReflashing(false)
      } else {
        setMenuCategory(null)
        setCurrentMenuCategory(null)
        setReflashing(false)
      }

      setLoading(false)
    })
  }

  React.useEffect(() => {
    let isSubscribed = true

    if (isSubscribed) {
      getMenuCategoryHandler()
    }

    return () => {
      isSubscribed = false
    }
  }, [])

  function addCategoryHandler () {
    const param = {
      encodeJson: true,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      ca_name: newCategory,
      ca_use: newCategoryVisible ? '1' : '0'
    }

    Api.send('store_item_category_input', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        setMenuCategory([])
        setCurrentMenuCategory([])
        getMenuCategoryHandler()
        toggleModal()
      } else {
        cusToast('오류가 발생하였습니다.\n관리자에게 문의해주세요.', 1500)
      }
    })
  }

  // 카테고리 수정
  function onEditCategoryHandler (cId, cName, cUse) {
    if (!cName) {
      cusToast('카테고리명을 입력해주세요.')
      return
    }

    const param = {
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      ca_id: cId,
      ca_name: cName,
      ca_use: cUse
    }

    console.log('cUse >>>', cUse)
    console.log('edit param >>>', param)
    // return false;

    Api.send('store_item_category_update', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        cusToast('카테고리가 수정되었습니다.')
        // setMenuCategory([]);
        getMenuCategoryHandler()
      } else {
        // getMenuCategoryHandler();
        cusToast('카테고리 수정 중에 오류가 발생하였습니다.\n관리자에게 문의해주세요.', 1500)
      }
    })
  }

  // 모달 토글
  const toggleModal = () => setIsModalVisible(prev => !prev)

  // const onHandleRefresh = () => getMenuCategoryHandler()

  const renderRow = ({ item, index }) => {
    return (
      <View key={item.ca_id} style={{ ...BaseStyle.container, ...BaseStyle.mb10 }}>
        <View style={{ flex: 3, ...BaseStyle.mr5 }}>
          <TextInput
            value={item.ca_name}
            placeholder='카테고리명을 입력해주세요.'
            style={{
              ...BaseStyle.border,
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.inputH
            }}
            onChangeText={val => changeCategoryName(val, index)}
          />
        </View>

        <TouchableOpacity
          onPress={() => insertCurrentCategory(item, index)}
          activeOpacity={1}
          style={{ ...BaseStyle.mr20 }}
        >
          <Text style={{ ...BaseStyle.ko15, textAlign: 'center', marginBottom: Platform.OS === 'ios' ? 2 : 5 }}>
            {item.ca_use === '1' ? '사용' : '미사용'}
          </Text>
          <Image
            source={
              item.ca_use === '1'
                ? require('../../images/on_btn.png')
                : require('../../images/off_btn.png')
            }
            style={{ width: Platform.OS === 'ios' ? 40 : 42, height: Platform.OS === 'ios' ? 20 : 21, borderRadius: 20 }}
            resizeMode='cover'
            fadeDuration={0}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => onEditCategoryHandler(item.ca_id, item.ca_name, item.ca_use)}
          disabled={!item.isChange}
        >
          <View
            style={{
              ...BaseStyle.border,
              ...BaseStyle.ph20,
              ...BaseStyle.inputH,
              backgroundColor: item.isChange ? Primary.PointColor02 : Disable.lightGray,
              borderColor: item.isChange ? Primary.PointColor02 : Disable.lightGray,
              paddingVertical: Platform.OS === 'ios' ? 7 : 13
            }}
          >
            <Text style={[{ ...BaseStyle.ko16 }, item.isChange ? { ...BaseStyle.font_white } : { ...BaseStyle.font_gray_a5 }]}>수정</Text>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  return (

    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}

      {!isLoading && <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Header navigation={navigation} title='카테고리 관리' />

        <Modal
          isVisible={isModalVisible}
          transparent
          statusBarTranslucent
          style={{ ...BaseStyle.ph10, ...BaseStyle.pv20 }}
          animationIn='bounceInUp'
          animationInTiming={500}
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
                  source={require('../../images/close_wh.png')}
                  style={{ width: 10, height: 10 }}
                  resizeMode={Platform.OS === 'ios' ? 'contain' : 'center'}
                />
              </TouchableOpacity>
              <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb15 }}>
                신규 카테고리를 입력해주세요.
              </Text>
              <View style={{ ...BaseStyle.container }}>
                <TextInput
                  value={newCategory}
                  placeholder='예: 세트류 or 밥류 or 면류 등'
                  style={{
                    ...BaseStyle.border,
                    ...BaseStyle.inputH,
                    ...BaseStyle.ph20,
                    width: '75%',
                    ...BaseStyle.mr5
                  }}
                  onChangeText={text => setNewCategory(text)}
                />
                <TouchableOpacity onPress={toggleCateVisible} activeOpacity={1}>
                  <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb5, textAlign: 'center' }}>
                    {newCategoryVisible ? '사용' : '미사용'}
                  </Text>
                  <Image
                    source={
                    newCategoryVisible
                      ? require('../../images/on_btn.png')
                      : require('../../images/off_btn.png')
                  }
                    style={{ width: 50, height: 25, borderRadius: 5 }}
                    resizeMode='cover'
                    fadeDuration={0}
                  />
                </TouchableOpacity>
              </View>
              <TouchableWithoutFeedback
                onPress={() => {
                  if (newCategory !== null && newCategory !== '') {
                    addCategoryHandler()
                  }
                }}
              >
                <View
                  style={{
                    width: 150,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor:
                    newCategory !== '' && newCategory !== null ? Primary.PointColor01 : '#e5e5e5',
                    backgroundColor:
                    newCategory !== '' && newCategory !== null ? Primary.PointColor01 : '#fff',
                    paddingVertical: 15,
                    borderRadius: 5,
                    ...BaseStyle.mt20
                  }}
                >
                  <Text
                    style={{
                      ...BaseStyle.ko14,
                      ...BaseStyle.font_bold,
                      color: newCategory !== '' && newCategory !== null ? '#fff' : '#e5e5e5'
                    }}
                  >
                    등록하기
                  </Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </KeyboardAvoidingView>
        </Modal>

        <View style={{ flex: 1, ...BaseStyle.ph20, ...BaseStyle.mt20 }}>

          <View style={{ ...BaseStyle.container3, ...BaseStyle.mb20 }}>
            <Text style={{ color: Primary.PointColor02, ...BaseStyle.ko13 }}>※ </Text>
            <Text style={{ color: Primary.PointColor02, ...BaseStyle.ko13 }} textBreakStrategy='balanced'>수정하실 때는 카테고리명 변경 또는 사용 여부를 선택하신 후, 우측 수정 버튼을 눌러주세요.</Text>
          </View>

          <FlatList
            bounces={false}
            data={currentMenuCategory}
            showVerticalScrollIndicator={false}
            renderItem={renderRow}
            keyExtractor={(list, index) => index.toString()}
            persistentScrollbar
            showsVerticalScrollIndicator={false}
            style={{ width: '100%' }}
            ListEmptyComponent={
              <View
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  flex: 1,
                  height: Dimensions.get('window').height - 300
                }}
              >
                <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
                  아직 등록된 카테고리가 없습니다.
                </Text>
              </View>
          }
          />
        </View>
        <TouchableOpacity
          activeOpacity={1}
          onPress={toggleModal}
          style={{ ...BaseStyle.mainBtnBottom }}
        >
          <Text style={{ ...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
            추가하기
          </Text>
        </TouchableOpacity>
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

export default CategoriesSetting
