import * as React from "react";
import {View, Text, TouchableOpacity, Image, Platform, Alert} from "react-native";
import {createMaterialTopTabNavigator} from "@react-navigation/material-top-tabs";
import BaseStyle, {Primary, customPickerStyles} from "../styles/Base";
import RNPickerSelect from "react-native-picker-select"; // 셀렉트박스 패키지
import DateTimePicker from "@react-native-community/datetimepicker";
import CalculateList from "../components/CalculateList";
import moment from "moment";

const Tab = createMaterialTopTabNavigator();

const CalculateTabView = () => {
  const Month = () => {
    const [selectedYear, setSelectedYear] = React.useState(""); // 년 선택
    const [selectedMonth, setSelectedMonth] = React.useState(""); // 월 선택

    // 년도 배열 만들기
    const [yearArr, setYearArr] = React.useState([]);
    const getYearRangeHandler = (param1, param2) => {
      const arr = [];

      let start = param1;
      let end = param2;

      let i = start;
      for (i; i <= end; i++) {
        // arr.push(i);
        arr.push({
          label: i + "년",
          value: i,
        });
      }

      setYearArr(arr);
    };

    const initialSelectedYear = payload => {
      setSelectedYear(payload);
    };

    const initialSelectedMonth = payload => {
      setSelectedMonth(payload);
    };

    React.useEffect(() => {
      const getNow = new Date();
      const getNowYear = getNow.getFullYear();
      const getNowMonth = getNow.getMonth() + 1;

      // getStatisticsAPI();
      getYearRangeHandler(2021, getNowYear);
      initialSelectedYear(getNowYear);
      initialSelectedMonth(getNowMonth);
    }, []);

    const monthArr = [
      {
        label: "1월",
        value: 1,
      },
      {
        label: "2월",
        value: 2,
      },
      {
        label: "3월",
        value: 3,
      },
      {
        label: "4월",
        value: 4,
      },
      {
        label: "5월",
        value: 5,
      },
      {
        label: "6월",
        value: 6,
      },
      {
        label: "7월",
        value: 7,
      },
      {
        label: "8월",
        value: 8,
      },
      {
        label: "9월",
        value: 9,
      },
      {
        label: "10월",
        value: 10,
      },
      {
        label: "11월",
        value: 11,
      },
      {
        label: "12월",
        value: 12,
      },
    ];

    const data = [
      {
        month: 3,
        calPrice: "5,795,000",
        status: 0,
      },
      {
        month: 2,
        calPrice: "1,995,000",
        status: 1,
      },
      {
        month: 1,
        calPrice: "2,775,000",
        status: 1,
      },
    ];

    return (
      <View style={{flex: 1, backgroundColor: "#fff", ...BaseStyle.ph20}}>
        <View style={{...BaseStyle.container5, ...BaseStyle.pv20}}>
          {/* <View style={{justifyContent:'center', alignItems:'flex-start', ...BaseStyle.border, ...BaseStyle.inputH, flex:1.5, ...BaseStyle.mr5, backgroundColor:'#fff', ...BaseStyle.pl20}}>
            <Text style={{...BaseStyle.ko14, marginTop:2}}>2021</Text>
          </View> */}
          <View style={{marginRight: 5, flex: 1.5}}>
            <RNPickerSelect
              fixAndroidTouchableBug
              value={selectedYear}
              useNativeAndroidPickerStyle={false}
              placeholder={{label: "선택해주세요.", value: null}}
              onValueChange={value => setSelectedYear(value)}
              items={yearArr}
              style={{
                ...customPickerStyles,
                justifyContent: "center",
                alignItems: "flex-start",
                ...BaseStyle.border,
                ...BaseStyle.inputH,
                backgroundColor: "#fff",
                ...BaseStyle.pl20,
                placeholder: {
                  color: "#888",
                },
              }}
              Icon={() => {
                return (
                  <Image
                    source={require("../images/ic_select.png")}
                    style={{width: 50, height: 50}}
                    resizeMode="center"
                  />
                );
              }}
            />
          </View>
          <View style={{marginRight: 5, flex: 1.5}}>
            <RNPickerSelect
              fixAndroidTouchableBug
              value={selectedMonth}
              useNativeAndroidPickerStyle={false}
              placeholder={{label: "선택해주세요.", value: null}}
              onValueChange={value => setSelectedMonth(value)}
              items={monthArr}
              style={{
                ...customPickerStyles,
                justifyContent: "center",
                alignItems: "flex-start",
                ...BaseStyle.border,
                ...BaseStyle.inputH,
                backgroundColor: "#fff",
                ...BaseStyle.pl20,
                placeholder: {
                  color: "#888",
                },
              }}
              Icon={() => {
                return (
                  <Image
                    source={require("../images/ic_select.png")}
                    style={{width: 50, height: 50}}
                    resizeMode="center"
                  />
                );
              }}
            />
          </View>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderColor: Primary.PointColor01,
              ...BaseStyle.inputH,
              flex: 1,
              backgroundColor: Primary.PointColor01,
            }}>
            <Text
              style={{
                ...BaseStyle.ko15,
                marginTop: 2,
                ...BaseStyle.font_bold,
                ...BaseStyle.textWhite,
              }}>
              조회
            </Text>
          </TouchableOpacity>
        </View>
        <CalculateList data={data} />
      </View>
    );
  };

  const During = () => {
    // 데이트 셀렉터
    const [date, setDate] = React.useState(new Date());
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const [mode, setMode] = React.useState("date");
    const [show, setShow] = React.useState(false);
    const [dateType, setDateType] = React.useState("");
    const [timeType, setTimeType] = React.useState("");

    const onChange = (event, selectedValue) => {
      const currentValue = selectedValue || date;
      setShow(Platform.OS === "ios");

      if (selectedValue > date) {
        Alert.alert("선택하신 날짜가 오늘 이후입니다.", "오늘까지 선택 가능합니다.", [
          {
            text: "확인",
          },
        ]);
      } else {
        if (dateType === "start") {
          if (currentValue > endDate) {
            Alert.alert("시작 날짜는 마감 날짜와 같거나 이전이어야 합니다.", "다시 선택해주세요.", [
              {
                text: "확인",
              },
            ]);
          } else {
            setStartDate(currentValue);
          }
        } else {
          if (currentValue < startDate) {
            Alert.alert("마감 날짜는 시작 날짜와 같거나 이후이어야 합니다.", "다시 선택해주세요.", [
              {
                text: "확인",
              },
            ]);
          } else {
            setEndDate(currentValue);
          }
        }
      }
    };

    const showMode = (currentMode, payload) => {
      setDateType(payload);
      setShow(true);
      setMode(currentMode);
    };

    const showDatepicker = payload => {
      showMode("date", payload);
    };

    const showTimepicker = payload => {
      showMode("time", payload);
    };

    const data = [
      {
        month: 3,
        calPrice: "5,795,000",
        status: 0,
      },
      {
        month: 2,
        calPrice: "1,995,000",
        status: 1,
      },
      {
        month: 1,
        calPrice: "2,775,000",
        status: 1,
      },
    ];

    return (
      <View style={{flex: 1, backgroundColor: "#fff", ...BaseStyle.ph20}}>
        <View style={{...BaseStyle.container5, ...BaseStyle.pv20}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => showDatepicker("start")}
            style={{
              ...BaseStyle.container,
              ...BaseStyle.border,
              ...BaseStyle.inputH,
              ...BaseStyle.mr5,
              ...BaseStyle.pl10,
              flex: 1.5,
              backgroundColor: "#fff",
            }}>
            <Image
              source={require("../images/ico_calendar.png")}
              style={{width: 20, height: 20, ...BaseStyle.mr5}}
              resizeMode="contain"
            />
            <Text style={{...BaseStyle.ko14, marginTop: 2}}>
              {moment(startDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          <Text style={{...BaseStyle.ko16, ...BaseStyle.mr5}}>~</Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => showDatepicker("end")}
            style={{
              ...BaseStyle.container,
              ...BaseStyle.border,
              ...BaseStyle.inputH,
              flex: 1.5,
              ...BaseStyle.mr5,
              backgroundColor: "#fff",
              ...BaseStyle.pl10,
            }}>
            <Image
              source={require("../images/ico_calendar.png")}
              style={{width: 20, height: 20, ...BaseStyle.mr5}}
              resizeMode="contain"
            />
            <Text style={{...BaseStyle.ko14, marginTop: 2}}>
              {moment(endDate).format("YYYY-MM-DD")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={1}
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 5,
              borderColor: Primary.PointColor01,
              ...BaseStyle.inputH,
              flex: 1,
              backgroundColor: Primary.PointColor01,
            }}>
            <Text
              style={{
                ...BaseStyle.ko15,
                marginTop: 2,
                ...BaseStyle.font_bold,
                ...BaseStyle.textWhite,
              }}>
              조회
            </Text>
          </TouchableOpacity>
        </View>
        <CalculateList data={data} />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour
            display="default"
            onChange={onChange}
          />
        )}
      </View>
    );
  };

  return (
    <Tab.Navigator
      initialRouteName="menu01"
      screenOptions={{
        tabBarActiveTintColor: "#222",
        tabBarLabelStyle: {...BaseStyle.ko14},
        tabBarInactiveTintColor: "#AEAEAE",
        tabBarIndicatorStyle: {
          backgroundColor: Primary.PointColor01,
        },
        tabBarPressColor: "transparent",
      }}>
      <Tab.Screen
        name="menu01"
        options={{
          tabBarLabel: "월별 조회",
        }}>
        {props => <Month {...props} />}
      </Tab.Screen>
      <Tab.Screen
        name="menu02"
        options={{
          tabBarLabel: "기간 조회",
        }}>
        {props => <During {...props} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default CalculateTabView;
