import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { useSelector, useDispatch } from 'react-redux'
import { TabView as LibTabView, SceneMap, TabBar } from 'react-native-tab-view'
import messaging from '@react-native-firebase/messaging'
import { Primary } from '../styles/Base'
import Api from '../Api'
import * as orderAction from '../redux/actions/orderAction'

import Tab01 from './OrderTabs/Tab01'
import Tab02 from './OrderTabs/Tab02'
import Tab03 from './OrderTabs/Tab03'
import Tab04 from './OrderTabs/Tab04'
import { OrderCategoryRequest } from '../data/modules/orderApi'

const getOrder = OrderCategoryRequest // 주문 내역 불러오기

const TabView = props => {
  const { navigation } = props
  const { mt_id: mtId, mt_jumju_code: mtJumjuCode } = useSelector(state => state.login)

  const dispatch = useDispatch()

  const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'menu01', title: '신규주문' },
    { key: 'menu02', title: '접수완료' },
    { key: 'menu03', title: '배달중' },
    { key: 'menu04', title: '처리완료' }
  ])

  // 주문 내역 호출
  const getOrderListHandler = React.useCallback((index) => {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: mtId,
      jumju_code: mtJumjuCode,
      od_process_status: index === 0 ? '신규주문' : index === 1 ? '접수완료' : index === 2 ? '배달중' : '배달완료'
    }

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem
      const arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        // setOrderList(arrItems)
        if (index === 0) {
          dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)))
        }

        if (index === 1) {
          dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)))
        }

        if (index === 2) {
          dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems)))
        }

        if (index === 3) {
          dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems)))
        }

        // setReflashing(false)
      } else {
        // setOrderList([])
        if (index === 0) {
          dispatch(orderAction.updateNewOrder(null))
        }

        if (index === 1) {
          dispatch(orderAction.updateCheckOrder(null))
        }

        if (index === 2) {
          dispatch(orderAction.updateDeliveryOrder(null))
        }

        if (index === 3) {
          dispatch(orderAction.updateDoneOrder(null))
        }
        // setReflashing(false)
      }
    })
  }, [index])

  React.useEffect(() => {
    const getMessage = messaging().onMessage(remoteMessage => {
      getOrderListHandler(0)
    })

    return () => getMessage()
  }, [])

  React.useEffect(() => {
    getOrderListHandler(index)

    return () => {
      getOrderListHandler(index)
    }
  }, [index])

  const renderScene = SceneMap({
    menu01: () => (<Tab01 navigation={navigation} />),
    menu02: () => (<Tab02 navigation={navigation} getOrderListHandler={getOrderListHandler} />),
    menu03: () => (<Tab03 navigation={navigation} />),
    menu04: () => (<Tab04 navigation={navigation} />)
  })

  const renderTabBar = props => (
    <TabBar
      {...props}
      getAccessibilityLabel={({ route }) => route.accessibilityLabel}
      activeColor={Primary.PointColor01}
      inactiveColor='#222'
      indicatorStyle={{ backgroundColor: Primary.PointColor01 }}
      style={{ backgroundColor: 'white' }}
    />
  )

  return (
    <LibTabView
      navigationState={{ index, routes }}
      renderTabBar={renderTabBar}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
    />
  )
}

export default TabView
