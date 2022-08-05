import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  FlatList,
  BackHandler
} from 'react-native'
import DropDownPicker from 'react-native-dropdown-picker'
import Header from '../components/SubHeader'
import BaseStyle, { Primary } from '../styles/Base'
import Api from '../Api'
import { notice } from 'npmlog'

const { width, height } = Dimensions.get('window')

const Notice = props => {
  const { navigation } = props

  const [list, setList] = React.useState([])

  const param = {
    encodeJson: true,
    bo_table: 'notice',
    item_count: 0,
    limit_count: 10
  }

  const getNoticeListHandler = () => {
    Api.send('store_board_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems
      if (resultItem.result === 'Y') {
        setList(arrItems)
      } else {
        setList(arrItems)
        // Alert.alert('접속이 잘 못 되었습니다.','', [
        //   {
        //     text: '확인'
        //   }
        // ]);
        // setButtonDisabled(false);
      }
    })
  }

  React.useEffect(() => {
    getNoticeListHandler()

    return () => getNoticeListHandler()
  }, [])

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  const renderRow = ({ item, index }) => {
    return (
      <TouchableOpacity
        activeOpacity={1}
        onPress={() =>
          navigation.navigate('Home', { screen: 'NoticeDetail', params: { item: item } })}
        key={index + item.wr_id}
      >
        <View style={{ ...BaseStyle.mv20, ...BaseStyle.container5, ...BaseStyle.ph20 }}>
          {item.pic.length > 0 && (
            <Image
              source={{ uri: `${item.pic[0]}` }}
              style={{ width: 30, height: 30, borderRadius: 10 }}
              resizeMode='cover'
            />
          )}
          <View>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mb5 }}>{item.subject}</Text>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_gray_a1 }}>{item.datetime}</Text>
          </View>
          <Image
            source={require('../images/set_arrow.png')}
            style={{ width: 10, height: 10 }}
            resizeMode='contain'
          />
        </View>
        <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />
      </TouchableOpacity>
    )
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='공지사항' />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      {/* 공지사항 리스트 */}
      <View style={{ flex: 1, height }}>
        <FlatList
          data={list}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing
          style={{ backgroundColor: '#fff', width: '100%' }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1
                // height: Dimensions.get('window').height - 300,
              }}
            >
              <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
                등록된 공지사항이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      {/* //공지사항 리스트 */}
    </View>
  )
}

export default Notice
