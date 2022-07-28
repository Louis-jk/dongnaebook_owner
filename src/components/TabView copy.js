import * as React from "react"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs" // TabView
import { useDispatch } from "react-redux"
import { Primary } from "../styles/Base"
import Tab01 from "./Tabs/Tab01"
import Tab02 from "./Tabs/Tab02"
import Tab03 from "./Tabs/Tab03"
import Tab04 from "./Tabs/Tab04"

const Tab = createMaterialTopTabNavigator()

const TabView = props => {
  const { navigation } = props
  const dispatch = useDispatch()

  const Tabs = [
    {
      name: "menu01",
      tabBarLabel: "신규주문",
      component: props => <Tab01 {...props} dispatch={dispatch} navigation={navigation} />,
    },
    {
      name: "menu02",
      tabBarLabel: "접수완료",
      component: props => <Tab02 {...props} dispatch={dispatch} navigation={navigation} />,
    },
    {
      name: "menu03",
      tabBarLabel: "배달중",
      component: props => <Tab03 {...props} dispatch={dispatch} navigation={navigation} />,
    },
    {
      name: "menu04",
      tabBarLabel: "처리완료",
      component: props => <Tab04 {...props} dispatch={dispatch} navigation={navigation} />,
    },
  ]

  return (
    <Tab.Navigator
      initialRouteName="menu01"
      screenOptions={{
        tabBarInactiveTintColor: "#aaa",
        tabBarActiveTintColor: "#222",
        tabBarAllowFontScaling: true,
        tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
        tabBarIndicatorStyle: {
          backgroundColor: Primary.PointColor01,
          height: 2,
        },
        tabBarPressColor: Primary.PointColor01,
      }}
      swipeEnabled
      keyboardDismissMode="on-drag"
    >
      {Tabs?.map((tab, index) => (
        <Tab.Screen
          key={`tab-${index}`}
          name={tab.name}
          options={{
            tabBarLabel: `${tab.tabBarLabel}`,
          }}
        >
          {tab.component}
        </Tab.Screen>
      ))}
    </Tab.Navigator>
  )
}

export default TabView
