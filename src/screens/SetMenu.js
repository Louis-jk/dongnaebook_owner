import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  BackHandler
} from 'react-native'
import { useSelector } from 'react-redux'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import AnimateLoading from '../components/AnimateLoading'
import Layout from '../layout'

const { width, height } = Dimensions.get('window')

const SetMenu = props => {
  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const [refleshing, setReflashing] = React.useState(false) // FlatList refleshing
  const [menuList, setMenuList] = React.useState([]) // 등록된 메뉴 리스트
  const [endCount, setEndCount] = React.useState(5) // 가져올 limit 아이템수
  const [isLoading, setLoading] = React.useState(true)

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const getMenuListHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      item_count: 0,
      limit_count: endCount,
      ca_code: 'all'
    }

    Api.send('store_item_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        setMenuList(arrItems)
        setEndCount(endCount + 5)
        setReflashing(false)
      } else {
        setMenuList(arrItems)
        setReflashing(false)
      }

      setLoading(false)
    })
  }

  const handleLoadMore = () => {
    getMenuListHandler()
  }

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getMenuListHandler()
    })
    return unsubscribe
  }, [navigation])

  const onHandleRefresh = () => {
    setReflashing(true)
    setEndCount(endCount + 10)
    getMenuListHandler()
  }

  const renderRow = ({ item, index }) => {
    return (
      <TouchableOpacity
        key={item.it_id + index}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('Home', { screen: 'SetMenuEdit', params: { item: item } })}
        style={{
          ...BaseStyle.container5,
          borderWidth: 1,
          borderColor: '#E3E3E3',
          backgroundColor: '#fff',
          borderRadius: 5,
          ...BaseStyle.pv20,
          ...BaseStyle.mb10
        }}
      >
        {item.it_img1 && (
          <View style={{ ...BaseStyle.ml20 }}>
            <Image
              source={{ uri: `${item.it_img1}` }}
              style={{ width: 80, height: 80, borderRadius: 10 }}
            />
          </View>
        )}
        <View style={{ flex: 3, ...BaseStyle.ph15 }}>
          <View style={{ ...BaseStyle.container }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222, ...BaseStyle.mr10 }}>
              {item.ca_name}
            </Text>
            {item.it_type1 === '1' && (
              <View
                style={{
                  backgroundColor: Primary.PointColor01,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingVertical: 2,
                  paddingHorizontal: 5,
                  borderRadius: 2,
                  ...BaseStyle.mr5
                }}
              >
                <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_white }}>대표</Text>
              </View>
            )}
            <View
              style={{
                backgroundColor: item.it_use === '1' ? Primary.PointColor02 : '#E5E5E5',
                justifyContent: 'center',
                alignItems: 'center',
                paddingVertical: 2,
                paddingHorizontal: 5,
                borderRadius: 2
              }}
            >
              <Text style={{ ...BaseStyle.ko12, color: item.it_use === '1' ? '#fff' : '#222' }}>
                {item.it_use === '1' ? '판매중' : '판매중지'}
              </Text>
            </View>
          </View>
          <Text
            style={{
              ...BaseStyle.ko18,
              ...BaseStyle.font_bold,
              ...BaseStyle.font_222,
              ...BaseStyle.mv10
            }}
            numberOfLines={1}
          >
            {item.it_name}
          </Text>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.mb5, ...BaseStyle.font_222 }}>
            {Api.comma(item.it_price)} 원
          </Text>
        </View>

        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#fff',
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5
          }}
        >
          <Image
            source={require('../images/pg_next.png')}
            style={{ width: 65, height: 65 }}
            resizeMode='center'
          />
        </View>
      </TouchableOpacity>
    )
  }

  const Content = () => (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='메뉴설정' />

      <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Home', { screen: 'SetMenuAdd' })}
          style={{ ...BaseStyle.mainBtn, ...BaseStyle.pv13 }}
        >
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
            메뉴 추가하기 +
          </Text>
        </TouchableOpacity>
      </View>

      {/* 메뉴 리스트 */}
      <View style={{ flex: 1, height }}>
        <FlatList
          data={menuList}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.8}
          style={{ backgroundColor: '#fff', width: '100%', ...BaseStyle.ph20 }}
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
                아직 등록된 메뉴가 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      {/* //메뉴 리스트 */}
    </View>
  )

  return (
    <>
      {isLoading && <AnimateLoading description='데이터를 불러오는 중입니다.' />}
      {!isLoading && <Layout child={<Content />} props={props} />}
    </>
  )
}

export default SetMenu
