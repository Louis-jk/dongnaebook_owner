import React from 'react'
import { View, Text, FlatList } from 'react-native'
import BaseStyle from '../../styles/Base'
import Divider from '../Divider'

const CalculateList = props => {
  const { data } = props

  const renderRow = ({ item, index }) => {
    return (
      <View key={`${item.month}-${index}`} style={{ ...BaseStyle.mv10 }}>
        <View style={{ ...BaseStyle.mb20, ...BaseStyle.container5 }}>
          <View style={{ ...BaseStyle.container }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mr30 }}>{item.month}월</Text>
            <Text style={{ ...BaseStyle.ko15 }}>{item.status !== 1 ? '정산중' : '정산완료'}</Text>
          </View>
          <Text style={{ ...BaseStyle.ko15 }}>{item.calPrice}원</Text>
        </View>
        <Divider />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

      <Divider style={{ ...BaseStyle.mb10 }} />

      <FlatList
        bounces={false}
        data={data}
        renderItem={renderRow}
        keyExtractor={(list, index) => index.toString()}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        refreshing
        style={{ backgroundColor: '#fff', width: '100%', ...BaseStyle.mt10 }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1
            }}
          >
            <Text style={{ ...BaseStyle.ko14, textAlign: 'center' }}>
              아직 처리된 주문이 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  )
}

export default CalculateList
