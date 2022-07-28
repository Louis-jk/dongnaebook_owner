import {View, Text, FlatList, Dimensions, TouchableOpacity, Image} from "react-native";
import React from "react";
import {useSelector} from "react-redux";
import moment from "moment";
import "moment/locale/ko";
import Header from "../components/SubHeader";
import Api from "../Api";
import BaseStyle, {Primary} from "../styles/Base";

const CancelOrders = props => {
  const {navigation} = props;
  const {mt_id: jumjuId, mt_jumju_code: jumjuCode} = useSelector(state => state.login);
  const [orderId, setOrderId] = React.useState(""); // 주문 ID
  const [orderType, setOrderType] = React.useState(""); // 주문 Type
  const [refleshing, setReflashing] = React.useState(false);

  // 주문 취소건
  const [cancelList, setCancelList] = React.useState([]);

  const param = {
    encodeJson: true,
    item_count: 0,
    limit_count: 10,
    jumju_id: jumjuId,
    jumju_code: jumjuCode,
    od_process_status: "주문취소",
  };

  const getCancelListHandler = () => {
    Api.send("store_order_list", param, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        setCancelList(arrItems);
      } else {
        setCancelList([]);
      }
    });
  };

  // React.useEffect(() => {
  //   getCancelListHandler()

  //   return () => getCancelListHandler()
  // }, [])

  React.useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      getCancelListHandler();
    });
    return unsubscribe;
  }, [navigation]);

  const renderRow = ({item, index}) => {
    console.log("cancel item::", item);
    return (
      <TouchableOpacity
        key={index}
        activeOpacity={1}
        onPress={() =>
          navigation.navigate("OrderDetail", {
            od_id: item.od_id,
            od_time: item.od_time,
            type: "cancel",
          })
        }>
        <View
          style={{
            backgroundColor: "#F8F8F8",
            width: "100%",
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10,
          }}>
          <Text style={{...BaseStyle.ko12, ...BaseStyle.font_gray_a1}}>
            {moment(item.od_time).format("YYYY년 M월 D일 HH:mm")}
          </Text>
        </View>
        <View style={{...BaseStyle.container7, ...BaseStyle.mb20, ...BaseStyle.ph20}}>
          <View style={{width: "76%"}}>
            <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5}}>
              {item.mb_company}
            </Text>
            <Text style={{...BaseStyle.ko12, ...BaseStyle.mb3}}>{item.od_good_name}</Text>
            <View style={{...BaseStyle.container}}>
              <Text
                style={[
                  {...BaseStyle.ko12},
                  item.od_settle_case === "선결제" ? BaseStyle.font_blue : BaseStyle.font_pink,
                ]}>
                {item.od_settle_case}
              </Text>
              <Text style={{...BaseStyle.ko12}}> / </Text>
              <Text style={{...BaseStyle.ko12}}>{Api.comma(item.od_receipt_price)}원</Text>
            </View>
            <View style={{...BaseStyle.container, ...BaseStyle.mt10}}>
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
                }}>
                <Image
                  source={require("../images/ic_map.png")}
                  style={{width: "100%", height: "100%"}}
                  resizeMode="center"
                />
              </View>
              <View>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    ...BaseStyle.lh17,
                  }}>
                  {`${item.od_addr1} ${item.od_addr2}`}
                </Text>
                {item.od_addr3 ? (
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.od_addr3}</Text>
                ) : null}
                {item.od_addr_jibeon ? (
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.od_addr_jibeon}</Text>
                ) : null}
              </View>
            </View>
          </View>
          <View
            style={{
              backgroundColor: Primary.PointColor03,
              width: 80,
              justifyContent: "center",
              alignItems: "center",
              ...BaseStyle.round05,
              ...BaseStyle.pv10,
              ...BaseStyle.mb5,
            }}>
            <Text style={{...BaseStyle.ko13}}>취소됨</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Header navigation={navigation} title="주문취소내역" />
      <FlatList
        data={cancelList}
        renderItem={renderRow}
        keyExtractor={(list, index) => index.toString()}
        // pagingEnabled={true}
        persistentScrollbar
        showsVerticalScrollIndicator={false}
        // progressViewOffset={true}
        refreshing={refleshing}
        // onRefresh={() => onHandleRefresh()}
        style={{backgroundColor: "#fff", width: "100%"}}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              height: Dimensions.get("window").height - 300,
            }}>
            <Text style={{...BaseStyle.ko15, textAlign: "center"}}>
              아직 취소된 주문이 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default CancelOrders;
