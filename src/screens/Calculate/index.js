import * as React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  BackHandler,
  Platform
} from 'react-native'
import Header from '../../components/Headers/SubHeader'
import BaseStyle, { Primary } from '../../styles/Base'
import CalculateTabView from '../../components/Calculate/CalculateTabView'
import Divider from '../../components/Divider'

const { height } = Dimensions.get('window')

const Calculate = props => {
  const { navigation } = props

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack()

    return true
  }

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction)
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction)
  }, [])

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='정산내역' />

      {/* 정산 금액 메인 */}
      <View style={{ ...BaseStyle.mv20, ...BaseStyle.ph20 }}>
        <View style={{ ...BaseStyle.container }}>
          <View style={{ flex: 2 }}>
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mb10 }}>
              8월 정산 금액{'  '}
              <Text style={{ color: Primary.PointColor02, ...BaseStyle.ml10 }}>정산중</Text>
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{ flex: 1, ...BaseStyle.mainBtn, ...BaseStyle.pv7, ...BaseStyle.ph5 }}
          >
            <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.textWhite, marginTop: Platform.OS === 'ios' ? -2 : 0 }}>
              누적 현황 보기
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{ ...BaseStyle.ko24, ...BaseStyle.font_bold }}>7,795,000원</Text>
        </View>
      </View>
      {/* //정산 금액 메인 */}

      <Divider height={10} backgroundColor='#F5F5F5' />

      {/* 월별조회/기간조회 탭 */}
      <View style={{ flex: 1, height }}>
        <CalculateTabView />
      </View>
      {/* //월별조회/기간조회 탭 */}

    </View>
  )
}

export default Calculate
