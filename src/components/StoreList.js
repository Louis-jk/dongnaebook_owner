import * as React from "react"
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions } from "react-native"
import BaseStyle, { Primary } from "../styles/Base"
import { useDispatch, useSelector } from "react-redux"
import * as storeAction from "../redux/actions/storeAction"

const StoreList = props => {
  const { navigation } = props

  const dispatch = useDispatch()
  const { allStore, selectedStore } = useSelector(state => state.store)

  const [lastIndex, setLastIndex] = React.useState("")
  React.useEffect(() => {
    if (allStore !== null) {
      setLastIndex(allStore.length)
    }
  }, [allStore])

  const renderRow = ({ item, index }) => {
    return (
      <>
        <TouchableOpacity
          key={item.id + index}
          activeOpacity={1}
          onPress={() => dispatch(storeAction.selectStore(`${item.id}`, `${item.name}`))}
          style={{
            ...BaseStyle.container,
            ...BaseStyle.ph10,
            ...BaseStyle.pv7,
            borderWidth: 1,
            borderColor: item.id === selectedStore.id ? Primary.PointColor01 : "#e5e5e5",
            borderRadius: 25,
            backgroundColor: item.id === selectedStore.id ? Primary.PointColor01 : "#fff",
            marginLeft: index !== 0 ? 10 : 20,
            marginRight: index === lastIndex - 1 ? 20 : 0,
          }}
        >
          <Text
            style={{ ...BaseStyle.ko14, color: item.id === selectedStore.id ? "#333" : "#333" }}
          >
            {item.name}
          </Text>
        </TouchableOpacity>
      </>
    )
  }

  return (
    <View style={{ ...BaseStyle.container, backgroundColor: "#fff", ...BaseStyle.pv7 }}>
      <View style={{ flex: 5 }}>
        <FlatList
          data={allStore}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing
          style={{ width: "100%" }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: Dimensions.get("window").height - 300,
              }}
            >
              <Text style={{ ...BaseStyle.ko15, textAlign: "center" }}>
                아직 처리된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => navigation.navigate("Home", { screen: "SelectStore" })}
        hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
        style={{
          ...BaseStyle.mr20,
          ...BaseStyle.ml10,
        }}
      >
        <Image
          source={require("../images/ic_menu2.png")}
          style={{ width: 30, height: 30 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </View>
  )
}

export default StoreList
