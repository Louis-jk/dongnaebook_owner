import * as React from 'react'
import { useWindowDimensions } from 'react-native'
import { useDispatch } from 'react-redux'
import { TabView as LibTabView, SceneMap, TabBar } from 'react-native-tab-view'

import { Primary } from '../../styles/Base'
import * as orderAction from '../../redux/actions/orderAction'

import Tab01 from './OrderTabs/Tab01'
import Tab02 from './OrderTabs/Tab02'
import Tab03 from './OrderTabs/Tab03'
import Tab04 from './OrderTabs/Tab04'
import Steps from '../../data/order/steps'

const TabView = props => {
  const { navigation } = props
  const dispatch = useDispatch()

  const layout = useWindowDimensions()

  const [index, setIndex] = React.useState(0)
  const [routes] = React.useState([
    { key: 'order01', testID: 'tab01', title: Steps[0] },
    { key: 'order02', testID: 'tab02', title: Steps[1] },
    { key: 'order03', testID: 'tab03', title: Steps[2] },
    { key: 'order04', testID: 'tab04', title: Steps[3] }
  ])

  // 주문 내역 호출
  const getOrderListHandler = React.useCallback((index) => {
    if (index === 0) {
      dispatch(orderAction.initNewOrderLimit(5))
      dispatch(orderAction.getNewOrder())
    }

    if (index === 1) {
      dispatch(orderAction.initCheckOrderLimit(5))
      dispatch(orderAction.getCheckOrder())
    }

    if (index === 2) {
      dispatch(orderAction.initDeliveryOrderLimit(5))
      dispatch(orderAction.getDeliveryOrder())
    }

    if (index === 3) {
      dispatch(orderAction.initDoneOrderLimit(5))
      dispatch(orderAction.getDoneOrder())
    }
  }, [index])

  React.useEffect(() => {
    getOrderListHandler(index)

    return () => {
      getOrderListHandler(index)
    }
  }, [index])

  const renderScene = SceneMap({
    order01: () => (<Tab01 navigation={navigation} />),
    order02: () => (<Tab02 navigation={navigation} getOrderListHandler={getOrderListHandler} />),
    order03: () => (<Tab03 navigation={navigation} />),
    order04: () => (<Tab04 navigation={navigation} />)
  })

  const renderTabBar = props => (
    <TabBar
      getTestID={({ route }) => route.testID}
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
    />
  )
}

export default TabView
