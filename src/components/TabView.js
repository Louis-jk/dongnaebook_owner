import * as React from "react"
import { View, Text, FlatList, TouchableOpacity, Image, Alert, Dimensions } from "react-native"
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs" // TabView
import { useSelector, useDispatch } from "react-redux"
import moment from "moment"
import "moment/locale/ko"
import messaging from "@react-native-firebase/messaging"
// import Toast from 'react-native-toast-message';
// import PushNotification from 'react-native-push-notification';
import BaseStyle, { Primary } from "../styles/Base"
import Api from "../Api"
import OrderCheckModal from "./OrderCheckModal"
import OrderRejectCancelModal from "./OrderRejectCancelModal"
import * as orderAction from "../redux/actions/orderAction"

const Tab = createMaterialTopTabNavigator()

const TabView = props => {
  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)

  const dispatch = useDispatch()

  const Tab01 = props => {
    const { navigation, list } = props
    const [orderId, setOrderId] = React.useState("") // 주문 ID
    const [orderType, setOrderType] = React.useState("") // 주문 Type
    const [refleshing, setReflashing] = React.useState(false)
    const { newOrder } = useSelector(state => state.order)
    const [jumjuId, setJumjuId] = React.useState("")
    const [jumjuCode, setJumjuCode] = React.useState("")

    // 주문 거부
    const [isModalVisible, setModalVisible] = React.useState(false)
    const [modalType, setModalType] = React.useState("")
    const toggleModal = payload => {
      setModalType(payload)
      setModalVisible(!isModalVisible)
    }

    // 주문 접수
    const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false)
    const toggleOrderCheckModal = () => {
      setOrderCheckModalVisible(!isOrderCheckModalVisible)
    }

    // 주문 건
    const [orderList, setOrderList] = React.useState([])

    const getOrderListHandler = () => {
      const param = {
        encodeJson: true,
        item_count: 0,
        limit_count: 10,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        od_process_status: "신규주문",
      }

      Api.send("store_order_list", param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === "Y") {
          setOrderList(arrItems)
          dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)))
          setReflashing(false)
        } else {
          setOrderList([])
          dispatch(orderAction.updateNewOrder(null))
          setReflashing(false)
        }
      })
    }

    React.useEffect(() => {
      getOrderListHandler()
      return () => getOrderListHandler()
    }, [])

    React.useEffect(() => {
      const getMessage = messaging().onMessage(remoteMessage => {
        getOrderListHandler()
      })

      return () => getMessage()
    }, [])

    const onHandleRefresh = () => {
      setReflashing(true)
      getOrderListHandler()
    }

    const renderRow = ({ item, index }) => {
      console.log("tab01 item::", item)
      return (
        <View key={index}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              width: "100%",
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}
          >
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_gray_a1 }}>
              {moment(item.od_time).format("YYYY년 M월 D일 HH:mm")}
            </Text>
          </View>
          <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: "76%" }}
              onPress={() =>
                navigation.navigate("OrderDetail", {
                  od_id: item.od_id,
                  od_time: item.od_time,
                  type: "ready",
                  jumjuId: item.jumju_id,
                  jumjuCode: item.jumju_code,
                })
              }
            >
              <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }} numberOfLines={1}>
                  {item.mb_company}
                </Text>
                <View
                  style={{
                    ...BaseStyle.pv2,
                    ...BaseStyle.ph5,
                    ...BaseStyle.ml10,
                    borderRadius: 5,
                    backgroundColor:
                      item.od_type === "배달" ? Primary.PointColor01 : Primary.PointColor02,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
                </View>
              </View>

              <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>

              <View style={{ ...BaseStyle.container }}>
                <Text
                  style={[
                    { ...BaseStyle.ko12 },
                    item.od_settle_case === "선결제" ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}
                >
                  {item.od_settle_case}
                </Text>
                <Text style={{ ...BaseStyle.ko12 }}> / </Text>
                <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
              </View>
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    ...BaseStyle.mr10,
                  }}
                >
                  <Image
                    source={require("../images/ic_map.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.lh17,
                    }}
                  >
                    {`${item.od_addr1} ${item.od_addr2}`}
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setOrderId(item.od_id)
                  setOrderType(item.od_type)
                  setJumjuId(item.jumju_id)
                  setJumjuCode(item.jumju_code)
                  toggleOrderCheckModal()
                }}
                style={{
                  backgroundColor: Primary.PointColor02,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  ...BaseStyle.round05,
                  ...BaseStyle.pv10,
                  ...BaseStyle.mb5,
                }}
              >
                <Text
                  style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white }}
                >
                  접수
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setOrderId(item.od_id)
                  setJumjuId(item.jumju_id)
                  setJumjuCode(item.jumju_code)
                  toggleModal("reject")
                }}
                style={{
                  ...BaseStyle.round05,
                  ...BaseStyle.pv10,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  backgroundColor: "#fff",
                }}
              >
                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666 }}>
                  주문거부
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        {orderList && orderList.length > 0 && (
          <OrderCheckModal
            isModalVisible={isOrderCheckModalVisible}
            toggleModal={toggleOrderCheckModal}
            oderId={orderId}
            orderType={orderType}
            navigation={navigation}
            jumjuId={jumjuId}
            jumjuCode={jumjuCode}
          />
        )}
        <OrderRejectCancelModal
          navigation={navigation}
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          modalType={modalType}
          od_id={orderId}
          jumjuId={jumjuId}
          jumjuCode={jumjuCode}
        />
        <FlatList
          data={newOrder}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          style={{ backgroundColor: "#fff", width: "100%" }}
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
                아직 신규 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    )
  }

  const Tab02 = props => {
    const { navigation, list } = props
    const { checkOrder } = useSelector(state => state.order)
    const [jumjuId, setJumjuId] = React.useState("")
    const [jumjuCode, setJumjuCode] = React.useState("")

    // 주문 건
    const [orderList, setOrderList] = React.useState([])
    const [orderId, setOrderId] = React.useState("") // 주문 ID

    const [refleshing, setReflashing] = React.useState(false)

    const getOrderListHandler = () => {
      const param = {
        encodeJson: true,
        item_count: 0,
        limit_count: 10,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        od_process_status: "접수완료",
      }

      Api.send("store_order_list", param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === "Y") {
          console.log("접수완료 arrItems", arrItems)
          setOrderList(arrItems)
          dispatch(orderAction.updateCheckOrder(JSON.stringify(arrItems)))
          setReflashing(false)
        } else {
          setOrderList([])
          dispatch(orderAction.updateCheckOrder(null))
          setReflashing(false)
        }
      })
    }

    // 주문 배달처리
    const sendDeliverHandler = (type, odId, jumjuId, jumjuCode) => {
      const param = {
        od_id: odId,
        jumju_id: jumjuId,
        jumju_code: jumjuCode,
        od_process_status: type === "배달" ? "배달중" : "포장완료",
        // delivery_time: time01,
        // visit_time: time02
      }

      console.log("배달처리 param", param)

      Api.send("store_order_status_update", param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === "Y") {
          getOrderListHandler()
          Alert.alert(`주문을 ${type === "배달" ? "배달" : "포장완료"} 처리하였습니다.`, "", [
            {
              text: "확인",
              onPress: () => navigation.navigate("Home", { screen: "Main" }),
            },
          ])
        } else {
          getOrderListHandler()
          Alert.alert(
            `주문 ${type === "배달" ? "배달" : "포장완료"} 처리중 오류가 발생하였습니다.`,
            "다시 한번 시도해주세요.",
            [
              {
                text: "확인",
                onPress: () => navigation.navigate("Home", { screen: "Main" }),
              },
            ]
          )
        }
      })
    }

    const deliveryOrderHandler = (type, orderId, jumjuId, jumjuCode) => {
      console.log("orderList ?", orderList)
      if (type === "배달") {
        Alert.alert("주문을 배달 처리하시겠습니까?", "", [
          {
            text: "네 배달처리",
            onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode),
          },
          {
            text: "아니요",
          },
        ])
      } else {
        Alert.alert("주문을 포장완료 처리하시겠습니까?", "", [
          {
            text: "네 포장완료",
            onPress: () => sendDeliverHandler(type, orderId, jumjuId, jumjuCode),
          },
          {
            text: "아니요",
          },
        ])
      }
    }

    // 주문 취소
    const [isModalVisible, setModalVisible] = React.useState(false)
    const [modalType, setModalType] = React.useState("")

    const toggleModal = payload => {
      setModalType(payload)
      setModalVisible(!isModalVisible)
    }

    React.useEffect(() => {
      getOrderListHandler()
      return () => getOrderListHandler()
    }, [])

    const onHandleRefresh = () => {
      setReflashing(true)
      getOrderListHandler()
    }

    const renderRow = ({ item, index }) => {
      console.log("tab02 item", item)
      return (
        <View key={item.od_id + index}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              width: "100%",
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}
          >
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_gray_a1 }}>
              {moment(item.od_time).format("YYYY년 M월 D일 HH:mm")}
            </Text>
          </View>
          <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: "76%" }}
              onPress={() =>
                navigation.navigate("OrderDetail", {
                  od_id: item.od_id,
                  od_time: item.od_time,
                  type: "doing",
                  jumjuId: item.jumju_id,
                  jumjuCode: item.jumju_code,
                })
              }
            >
              <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{item.mb_company}</Text>
                <View
                  style={{
                    ...BaseStyle.pv2,
                    ...BaseStyle.ph5,
                    ...BaseStyle.ml10,
                    borderRadius: 5,
                    backgroundColor:
                      item.od_type === "배달" ? Primary.PointColor01 : Primary.PointColor02,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
                </View>
              </View>
              <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
              <View style={{ ...BaseStyle.container }}>
                <Text
                  style={[
                    { ...BaseStyle.ko12 },
                    item.od_settle_case === "선결제" ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}
                >
                  {item.od_settle_case}
                </Text>
                <Text style={{ ...BaseStyle.ko12 }}> / </Text>
                <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
              </View>
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    ...BaseStyle.mr10,
                  }}
                >
                  <Image
                    source={require("../images/ic_map.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.lh17,
                    }}
                  >
                    {`${item.od_addr1} ${item.od_addr2}`}
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setOrderId(item.od_id)
                  deliveryOrderHandler(item.od_type, item.od_id, item.jumju_id, item.jumju_code)
                }}
                style={{
                  backgroundColor:
                    item.od_type === "배달" ? Primary.PointColor01 : Primary.PointColor02,
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  ...BaseStyle.round05,
                  ...BaseStyle.pv10,
                  ...BaseStyle.mb5,
                }}
              >
                <Text
                  style={{
                    ...BaseStyle.ko13,
                    ...BaseStyle.font_bold,
                    // color: item.od_type === "배달" ? "#fff" : "#fff",
                    color: "#fff",
                  }}
                >
                  {item.od_type === "배달" ? "배달처리" : "포장완료"}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setOrderId(item.od_id)
                  setJumjuId(item.jumju_id)
                  setJumjuCode(item.jumju_code)
                  toggleModal("cancel")
                }}
                style={{
                  backgroundColor: "#fff",
                  width: 80,
                  justifyContent: "center",
                  alignItems: "center",
                  ...BaseStyle.round05,
                  ...BaseStyle.pv10,
                  borderWidth: 1,
                  borderColor: "#E3E3E3",
                  ...BaseStyle.round05,
                }}
              >
                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666 }}>
                  주문취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <OrderRejectCancelModal
          navigation={navigation}
          isModalVisible={isModalVisible}
          toggleModal={toggleModal}
          modalType={modalType}
          od_id={orderId}
          jumjuId={jumjuId}
          jumjuCode={jumjuCode}
          getOrderListHandler={getOrderListHandler}
        />
        <FlatList
          data={checkOrder}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          style={{ backgroundColor: "#fff", width: "100%" }}
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
                아직 접수된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    )
  }

  const Tab03 = props => {
    const { navigation, list } = props

    const { deliveryOrder } = useSelector(state => state.order)

    // 주문 건
    const [orderList, setOrderList] = React.useState([])
    const [refleshing, setReflashing] = React.useState(false)

    const getOrderListHandler = () => {
      const param = {
        encodeJson: true,
        item_count: 0,
        limit_count: 10,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        od_process_status: "배달중",
      }

      Api.send("store_order_list", param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === "Y") {
          setOrderList(arrItems)
          dispatch(orderAction.updateDeliveryOrder(JSON.stringify(arrItems)))
          setReflashing(false)
        } else {
          setOrderList([])
          dispatch(orderAction.updateDeliveryOrder(null))
          setReflashing(false)
        }
      })
    }

    React.useEffect(() => {
      getOrderListHandler()
      return () => getOrderListHandler()
    }, [])

    const onHandleRefresh = () => {
      setReflashing(true)
      getOrderListHandler()
    }

    const renderRow = ({ item, index }) => {
      return (
        <View key={item.od_id + index}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              width: "100%",
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}
          >
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_gray_a1 }}>
              {moment(item.od_time).format("YYYY년 M월 D일 HH:mm")}
            </Text>
          </View>
          <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: "100%" }}
              onPress={() =>
                navigation.navigate("OrderDetail", {
                  od_id: item.od_id,
                  od_time: item.od_time,
                  type: "going",
                  jumjuId: item.jumju_id,
                  jumjuCode: item.jumju_code,
                })
              }
            >
              <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>{item.mb_company}</Text>
                <View
                  style={{
                    ...BaseStyle.pv2,
                    ...BaseStyle.ph5,
                    ...BaseStyle.ml10,
                    borderRadius: 5,
                    backgroundColor:
                      item.od_type === "배달" ? Primary.PointColor01 : Primary.PointColor02,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
                </View>
              </View>
              <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
              <View style={{ ...BaseStyle.container }}>
                <Text
                  style={[
                    { ...BaseStyle.ko12 },
                    item.od_settle_case === "선결제" ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}
                >
                  {item.od_settle_case}
                </Text>
                <Text style={{ ...BaseStyle.ko12 }}> / </Text>
                <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
              </View>
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    ...BaseStyle.mr10,
                  }}
                >
                  <Image
                    source={require("../images/ic_map.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.lh17,
                    }}
                  >
                    {`${item.od_addr1} ${item.od_addr2}`}
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={deliveryOrder}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          style={{ backgroundColor: "#fff", width: "100%" }}
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
                아직 배달중인 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    )
  }

  const Tab04 = props => {
    const { navigation, list } = props

    const { doneOrder } = useSelector(state => state.order)

    // 주문 건
    const [orderList, setOrderList] = React.useState([])
    const [refleshing, setReflashing] = React.useState(false)

    const getOrderListHandler = () => {
      const param = {
        encodeJson: true,
        item_count: 0,
        limit_count: 10,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        od_process_status: "배달완료",
      }

      Api.send("store_order_list", param, args => {
        const resultItem = args.resultItem
        const arrItems = args.arrItems

        if (resultItem.result === "Y") {
          setOrderList(arrItems)
          dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems)))
          setReflashing(false)
        } else {
          setOrderList([])
          dispatch(orderAction.updateDoneOrder(null))
          setReflashing(false)
          // Alert.alert('데이터를 받아오는데 오류가 발생하였습니다.','관리자에게 문의해주세요.', [
          //   {
          //     text: '확인'
          //   }
          // ]);
        }
      })
    }

    React.useEffect(() => {
      getOrderListHandler()
      return () => getOrderListHandler()
    }, [])

    const onHandleRefresh = () => {
      setReflashing(true)
      getOrderListHandler()
    }

    const renderRow = ({ item, index }) => {
      console.log("item", item)
      return (
        <View key={item.od_id + index}>
          <View
            style={{
              backgroundColor: "#F8F8F8",
              width: "100%",
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}
          >
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_gray_a1 }}>
              {moment(item.od_time).format("YYYY년 M월 D일 HH:mm")}
            </Text>
          </View>
          <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
            <TouchableOpacity
              activeOpacity={1}
              style={{ width: "100%" }}
              onPress={() =>
                navigation.navigate("OrderDetail", {
                  od_id: item.od_id,
                  od_time: item.od_time,
                  type: "done",
                  jumjuId: item.jumju_id,
                  jumjuCode: item.jumju_code,
                })
              }
            >
              <View style={{ ...BaseStyle.container, ...BaseStyle.mb5 }}>
                <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }} numberOfLines={1}>
                  {item.mb_company}
                </Text>
                <View
                  style={{
                    ...BaseStyle.pv2,
                    ...BaseStyle.ph5,
                    ...BaseStyle.ml10,
                    borderRadius: 5,
                    backgroundColor:
                      item.od_type === "배달" ? Primary.PointColor01 : Primary.PointColor02,
                  }}
                >
                  <Text style={{ ...BaseStyle.ko10, ...BaseStyle.font_white }}>{item.od_type}</Text>
                </View>
              </View>
              <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
              <View style={{ ...BaseStyle.container }}>
                <Text
                  style={[
                    { ...BaseStyle.ko12 },
                    item.od_settle_case === "선결제" ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}
                >
                  {item.od_settle_case}
                </Text>
                <Text style={{ ...BaseStyle.ko12 }}> / </Text>
                <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
              </View>
              <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
                <View
                  style={{
                    borderWidth: 1,
                    borderColor: "#E3E3E3",
                    borderRadius: 50,
                    justifyContent: "center",
                    alignItems: "center",
                    width: 40,
                    height: 40,
                    ...BaseStyle.mr10,
                  }}
                >
                  <Image
                    source={require("../images/ic_map.png")}
                    style={{ width: "100%", height: "100%" }}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text
                    style={{
                      ...BaseStyle.ko12,
                      ...BaseStyle.lh17,
                    }}
                  >
                    {`${item.od_addr1} ${item.od_addr2}`}
                  </Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      )
    }

    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <FlatList
          data={doneOrder}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          style={{ backgroundColor: "#fff", width: "100%" }}
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
                아직 배달완료된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    )
  }

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
      <Tab.Screen
        name="menu01"
        options={{
          tabBarLabel: "신규주문",
        }}
      >
        {props => <Tab01 {...props} navigation={navigation} />}
      </Tab.Screen>

      <Tab.Screen
        name="menu02"
        options={{
          tabBarLabel: "접수완료",
        }}
      >
        {props => <Tab02 {...props} navigation={navigation} />}
      </Tab.Screen>

      <Tab.Screen
        name="menu03"
        options={{
          tabBarLabel: "배달중",
        }}
      >
        {props => <Tab03 {...props} navigation={navigation} />}
      </Tab.Screen>

      <Tab.Screen
        name="menu04"
        options={{
          tabBarLabel: "처리완료",
        }}
      >
        {props => <Tab04 {...props} navigation={navigation} />}
      </Tab.Screen>
    </Tab.Navigator>
  )
}

export default TabView
