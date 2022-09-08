import React from 'react'
import { View, FlatList } from 'react-native'
import OrderEmpty from './OrderEmpty'
import OrderInfo from './OrderInfo'
import OrderButtons from './OrderButtons'
import OrderRender from './OrderRender'

const TabLayout = props => {
  const {
    navigation,
    orders,
    index: tabIndex,
    toggleOrderCheckModal,
    toggleModal,
    onHandleRefresh,
    handleLoadMore,
    refleshing,
    deliveryOrderHandler,
    setOrderId,
    setOrderType,
    setJumjuId,
    setJumjuCode
  } = props

  const renderRow = ({ item, index }) => {
    return (
      <OrderRender key={index} item={item}>

        <OrderInfo
          navigation={navigation}
          item={item}
          tabIndex={tabIndex}
        />
        <OrderButtons
          tabIndex={tabIndex}
          item={item}
          setOrderId={setOrderId}
          setOrderType={setOrderType}
          setJumjuId={setJumjuId}
          setJumjuCode={setJumjuCode}
          toggleOrderCheckModal={toggleOrderCheckModal}
          toggleModal={toggleModal}
          deliveryOrderHandler={deliveryOrderHandler}
          navigation={navigation}
        />

      </OrderRender>
    )
  }

  return (

    <View style={{ width: '100%', flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <FlatList
        bounces={false}
        data={orders}
        renderItem={renderRow}
        keyExtractor={(list, index) => index.toString()}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        refreshing={refleshing}
        onRefresh={() => onHandleRefresh()}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.4}
        style={{ backgroundColor: '#fff', width: '100%' }}
        ListEmptyComponent={
          <OrderEmpty text={tabIndex === 1 ? '신규' : tabIndex === 2 ? '접수된' : tabIndex === 3 ? '배달중인' : tabIndex === 4 ? '완료된' : tabIndex === 5 ? '취소된' : ''} />
          }
      />
    </View>

  )
}

export default TabLayout
