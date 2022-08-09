import React from 'react'
import { View, Text, FlatList } from 'react-native'
import BaseStyle, { Primary } from '../styles/Base'

const CalculateList = props => {
  const { data } = props

  const renderRow = ({ item, index }) => {
    return (
      <View key={item.month} style={{ ...BaseStyle.mv10 }}>
        <View style={{ ...BaseStyle.mb20, ...BaseStyle.container5 }}>
          <View style={{ ...BaseStyle.container }}>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.mr30 }}>{item.month}월</Text>
            <Text style={{ ...BaseStyle.ko15 }}>{item.status !== 1 ? '정산중' : '정산완료'}</Text>
          </View>
          <Text style={{ ...BaseStyle.ko15 }}>{item.calPrice}원</Text>
        </View>
        <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3' }} />
      </View>
    )
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{ height: 1, width: '100%', backgroundColor: '#E3E3E3', ...BaseStyle.mb10 }} />
      <FlatList
        data={data}
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
