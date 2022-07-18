import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Dimensions,
  ScrollView,
  BackHandler,
} from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import Header from "../components/SubHeader";
import BaseStyle, {Primary} from "../styles/Base";
import CalculateTabView from "../components/CalculateTabView";

const {width, height} = Dimensions.get("window");

const Calculate = props => {
  const {navigation} = props;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    {label: "Apple", value: "apple"},
    {label: "Banana", value: "banana"},
  ]);

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Header navigation={navigation} title="정산내역" />

      {/* 정산 금액 메인 */}
      <View style={{...BaseStyle.mv20, ...BaseStyle.ph20}}>
        <View style={{...BaseStyle.container}}>
          <View style={{flex: 3}}>
            <Text style={{...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              3월 정산 금액{"  "}
              <Text style={{color: Primary.PointColor02, ...BaseStyle.ml10}}>정산중</Text>
            </Text>
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{flex: 1, ...BaseStyle.mainBtn, ...BaseStyle.pv7, ...BaseStyle.ph5}}>
            <Text style={{...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.textWhite}}>
              누적 현황 보기
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          <Text style={{...BaseStyle.ko24, ...BaseStyle.font_bold}}>5,795,000원</Text>
        </View>
      </View>
      {/* //정산 금액 메인 */}
      <View style={{height: 10, backgroundColor: "#F5F5F5"}} />
      {/* 월별조회/기간조회 탭 */}
      <View style={{flex: 1, height}}>
        <CalculateTabView />
      </View>
      {/* //월별조회/기간조회 탭 */}
    </View>
  );
};

export default Calculate;
