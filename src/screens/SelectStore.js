import * as React from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  BackHandler,
} from "react-native";
import BaseStyle from "../styles/Base";
import {useDispatch, useSelector} from "react-redux";
import * as storeAction from "../redux/actions/storeAction";
import * as loginAction from "../redux/actions/loginAction";
import Api from "../Api";

const SelectStore = props => {
  const {navigation} = props;

  const dispatch = useDispatch();
  const {allStore, selectedStore} = useSelector(state => state.store);
  const {mt_store, mt_app_token} = useSelector(state => state.login);

  const setStoreHandler = (item, id, jumju_id, jumju_code, store, addr) => {
    dispatch(storeAction.selectStore(id, jumju_id, jumju_code, store, addr));
    dispatch(loginAction.updateLogin(JSON.stringify(item)));
    dispatch(loginAction.updateToken(JSON.stringify(mt_app_token)));

    let param = {
      mt_id: jumju_id,
      mt_app_token: mt_app_token,
    };

    Api.send("store_login_token", param, args => {
      let resultItem = args.resultItem;
      let arrItems = args.arrItems;
      console.log("토큰 업데이트 실행시 resultItem::: ", resultItem);
      console.log("토큰 업데이트 실행시  arrItems::: ", arrItems);
      if (resultItem.result === "Y") {
        console.log("토큰 업데이트 실행 결과값 ::: ", arrItems);
      } else {
        console.log("토큰 업데이트 실패");
      }
    });
    // navigation.navigate('Home', {screen:'Main'});
  };

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  const renderRow = ({item, index}) => {
    console.log("====================================");
    console.log("item ??", item);
    console.log("====================================");
    return (
      <View key={index}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            setStoreHandler(
              item,
              item.id,
              item.mt_id,
              item.mt_jumju_code,
              item.mt_store,
              item.mt_addr,
            )
          }
          style={{...BaseStyle.mv20, ...BaseStyle.pv5, ...BaseStyle.container5}}>
          <View style={{width: "80%"}}>
            <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.mb5}}>
              {item.mt_store}
            </Text>
            <Text style={{...BaseStyle.ko14, ...BaseStyle.lh22}}>{item.mt_addr}</Text>
          </View>
          <Image
            source={
              selectedStore.id === item.id
                ? require("../images/ic_check_on.png")
                : require("../images/ic_check_off.png")
            }
            style={{width: 20, height: 20}}
          />
        </TouchableOpacity>

        <View style={{height: 1, backgroundColor: "#E3E3E3"}} />
      </View>
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <View
        style={{
          ...BaseStyle.container5,
          ...BaseStyle.ph20,
          ...BaseStyle.pv20,
          backgroundColor: "#fff",
        }}>
        <View style={{flex: 1, justifyContent: "center", alignItems: "center"}}>
          <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold}}>매장 선택</Text>
        </View>

        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate("Home", {screen: "Main"})}
          hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
          <Image
            source={require("../images/pop_close_bk.png")}
            style={{width: 22, height: 22}}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      <View style={{height: 1, backgroundColor: "#E3E3E3"}} />

      <View style={{flex: 1, ...BaseStyle.ph20}}>
        <FlatList
          data={allStore}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar={true}
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={true}
          style={{backgroundColor: "#fff", width: "100%"}}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                flex: 1,
                height: Dimensions.get("window").height - 300,
              }}>
              <Text style={{...BaseStyle.ko15, textAlign: "center", ...BaseStyle.mb10}}>
                <Text
                  style={{
                    ...BaseStyle.ko18,
                    ...BaseStyle.font_bold,
                    textAlign: "center",
                    ...BaseStyle.mb10,
                  }}>
                  {mt_store}
                </Text>{" "}
                외에
              </Text>
              <Text style={{...BaseStyle.ko15, textAlign: "center"}}>
                아직 등록된 매장이 없습니다.
              </Text>
            </View>
          }
        />
        {/* 매장 추가 신청 버튼 */}
        {/* <TouchableOpacity
          activeOpacity={1}
          onPress={() => alert('hi')}
          style={{...BaseStyle.mainBtn, ...BaseStyle.inputH, ...BaseStyle.mv20}}>
          <View style={{...BaseStyle.container0}}>
            <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.mr10}}>
                매장 추가 신청
            </Text>
            <Image
              source={require('../images/plus.png')}
              style={{width: 18, height: 18}}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity> */}
        {/* // 매장 추가 신청 버튼 */}
      </View>
    </SafeAreaView>
  );
};

export default SelectStore;
