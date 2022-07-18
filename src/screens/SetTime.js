import * as React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  Alert,
  ScrollView,
  Dimensions,
} from "react-native";
import Header from "../components/SubHeader";
import BaseStyle, {Primary} from "../styles/Base";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useSelector, useDispatch} from "react-redux";
import moment from "moment";
import "moment/locale/ko";
import Api from "../Api";
import * as storeTimeAction from "../redux/actions/storeTimeAction";
import cusToast from "../components/CusToast";

const SetTime = props => {
  const {navigation} = props;
  const {mt_id, mt_jumju_code} = useSelector(state => state.login);
  const [existWeek, setExistWeek] = React.useState([]);

  const dispatch = useDispatch();

  // 주일
  const weekData = [
    {
      idx: "0",
      en: "sun",
      ko: "일",
    },
    {
      idx: "1",
      en: "mon",
      ko: "월",
    },
    {
      idx: "2",
      en: "tue",
      ko: "화",
    },
    {
      idx: "3",
      en: "wed",
      ko: "수",
    },
    {
      idx: "4",
      en: "thu",
      ko: "목",
    },
    {
      idx: "5",
      en: "fri",
      ko: "금",
    },
    {
      idx: "6",
      en: "sat",
      ko: "토",
    },
  ];

  const [selectDay, setSelectDay] = React.useState([]);
  const selectDayHandler = payload => {
    const filtered = selectDay.find(day => day === payload);

    if (!filtered) {
      setSelectDay([...new Set([...selectDay, payload])]);
    } else {
      const removeObj = selectDay.filter(day => day !== payload);
      setSelectDay(removeObj);
    }
  };

  // 데이트 셀렉터
  const [date, setDate] = React.useState(new Date());
  const [startTime, setStartTime] = React.useState(new Date());
  const [endTime, setEndTime] = React.useState(new Date());
  const [mode, setMode] = React.useState("date");
  const [show, setShow] = React.useState(false);
  const [timeType, setTimeType] = React.useState("");

  const onChange = (event, selectedValue) => {
    const currentValue = selectedValue || date;
    setShow(Platform.OS === "ios");
    if (mode === "date") {
      setDate(currentValue);
    } else {
      if (timeType === "start") {
        if (currentValue > endTime) {
          cusToast("시작시간은 마감시간 이전 시간이어야합니다.");
        } else {
          setStartTime(currentValue);
        }
      } else {
        if (currentValue < startTime) {
          cusToast("마감시간은 시작시간 이후 시간이어야합니다.");
        } else {
          setEndTime(currentValue);
        }
      }
    }
  };

  const showMode = (currentMode, payload) => {
    setTimeType(payload);
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const showTimepicker = payload => {
    showMode("time", payload);
  };

  const getStoreTimeHandler = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: "list",
    };
    Api.send("store_service_hour", param, args => {
      const resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === "Y") {
        console.log("store Service hour arrItems", arrItems);

        let result = arrItems.reduce((acc, curr, i) => {
          const toArr = curr.st_yoil.split(",");
          acc.push(toArr);
          return acc;
        }, []);

        let flatArr = result.flat(Infinity);
        let flatArrSort = flatArr.sort();
        // console.log('flatArrSort', flatArrSort);
        setExistWeek(flatArrSort);

        // arrItems.filter(el => el.st_yo)
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)));
      } else {
        dispatch(storeTimeAction.updateStoreTime(JSON.stringify(arrItems)));
      }
    });
  };

  const setStoreTimeHandler = () => {
    const selectDayFormat = selectDay.join();
    let startTimeFormat = moment(startTime).format("h:mm");
    let endTimeFormat = moment(endTime).format("h:mm");

    if (selectDay === null || selectDay === "" || selectDay.length === 0) {
      cusToast("요일을 선택해주세요.");
    } else if (startTime >= endTime) {
      cusToast("시작시간은 마감시간 이전 시간이어야합니다.");
    } else if (endTime <= startTime) {
      cusToast("마감시간은 시작시간 이후 시간이어야합니다.");
    } else {
      const param = {
        encodeJson: true,
        jumju_id: mt_id,
        jumju_code: mt_jumju_code,
        mode: "update",
        st_yoil: selectDayFormat,
        st_stime: startTimeFormat,
        st_etime: endTimeFormat,
      };
      Api.send("store_service_hour", param, args => {
        const resultItem = args.resultItem;
        let arrItems = args.arrItems;

        if (resultItem.result === "Y") {
          getStoreTimeHandler();
          Alert.alert("영업시간을 추가하였습니다.", "리스트로 이동합니다.", [
            {
              text: "확인",
              onPress: () => navigation.navigate("Home", {screen: "SetDayTime"}),
            },
          ]);
        } else {
          Alert.alert("영업시간을 추가할 수 없습니다.", "다시 한번 시도해주세요.", [
            {
              text: "확인",
              onPress: () => navigation.navigate("Home", {screen: "SetDayTime"}),
            },
          ]);
        }
      });
    }
  };

  React.useEffect(() => {
    getStoreTimeHandler();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: "#fff"}}>
      <Header navigation={navigation} title="영업 시간 추가" type="save" />
      {/* <StatusMenu navigation={navigation} /> */}

      <ScrollView>
        <View style={{height: 1, width: "100%", ...BaseStyle.mb10}} />

        {/* 영업시간 */}
        <View
          style={{
            ...BaseStyle.ph20,
            ...BaseStyle.mv10,
            flex: 1,
            flexDirection: "row",
            width: "100%",
          }}>
          {weekData.map((day, index) => (
            <TouchableOpacity
              key={index}
              activeOpacity={1}
              onPress={() => {
                if (existWeek.includes(day.idx)) {
                  cusToast("이미 등록된 요일입니다.");
                  return false;
                } else {
                  selectDayHandler(day.idx);
                }
              }}
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: Dimensions.get("window").width / 9.8,
                height: Dimensions.get("window").width / 9.8,
                borderRadius: Dimensions.get("window").width / 9.8,
                backgroundColor: existWeek.includes(day.idx)
                  ? "#efefef"
                  : selectDay.includes(day.idx)
                  ? Primary.PointColor01
                  : "#fff",
                borderWidth: 1,
                borderColor: existWeek.includes(day.idx)
                  ? "#efefef"
                  : selectDay.includes(day.idx)
                  ? Primary.PointColor01
                  : "#E3E3E3",
                marginLeft: index !== 0 ? 10 : 0,
              }}>
              <Text
                style={{
                  color: existWeek.includes(day.idx)
                    ? "#fff"
                    : selectDay.includes(day.idx)
                    ? "#fff"
                    : "#222",
                }}>
                {day.ko}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {/* //영업시간 */}

        <View style={{...BaseStyle.ph20}}>
          <View
            style={{
              height: 1,
              width: "100%",
              backgroundColor: "#E3E3E3",
              ...BaseStyle.mv10,
              ...BaseStyle.mb20,
            }}
          />
          <View>
            <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              시작시간
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => showTimepicker("start")}
              style={{...BaseStyle.container, ...BaseStyle.mb10}}>
              <View
                style={{flex: 1, ...BaseStyle.border, ...BaseStyle.inputH, ...BaseStyle.container}}>
                <Image
                  source={require("../images/alarm-clock.png")}
                  style={{width: 23, height: 23, ...BaseStyle.mh10}}
                  resizeMode="contain"
                />
                <Text>{moment(startTime).format("a")}</Text>
              </View>
              <Text style={{...BaseStyle.mh10, ...BaseStyle.ko20}} />
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text>{moment(startTime).format("h")}</Text>
              </View>
              <Text style={{...BaseStyle.mh10, ...BaseStyle.ko20}}>:</Text>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text>{moment(startTime).format("mm")}</Text>
              </View>
            </TouchableOpacity>
            <Text style={{...BaseStyle.ko14, ...BaseStyle.mb30, color: Primary.PointColor02}}>
              상단 박스를 눌러 시작시간을 설정해주세요.
            </Text>

            <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb10}}>
              마감시간
            </Text>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => showTimepicker("end")}
              style={{...BaseStyle.container, ...BaseStyle.mb10}}>
              <View
                style={{flex: 1, ...BaseStyle.border, ...BaseStyle.inputH, ...BaseStyle.container}}>
                <Image
                  source={require("../images/alarm-clock.png")}
                  style={{width: 23, height: 23, ...BaseStyle.mh10}}
                  resizeMode="contain"
                />
                <Text>{moment(endTime).format("a")}</Text>
              </View>
              <Text style={{...BaseStyle.mh10, ...BaseStyle.ko20}} />
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text>{moment(endTime).format("h")}</Text>
              </View>
              <Text style={{...BaseStyle.mh10, ...BaseStyle.ko20}}>:</Text>
              <View
                style={{
                  flex: 1,
                  ...BaseStyle.border,
                  ...BaseStyle.inputH,
                  justifyContent: "center",
                  alignItems: "center",
                }}>
                <Text>{moment(endTime).format("mm")}</Text>
              </View>
            </TouchableOpacity>
            <Text style={{...BaseStyle.ko14, ...BaseStyle.mb30, color: Primary.PointColor02}}>
              상단 박스를 눌러 시작시간을 설정해주세요.
            </Text>
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
        </View>

        {/* 24시간 운영 */}
        {/* <View style={{...BaseStyle.ph20, ...BaseStyle.mb20}}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => toggleCheckAllTimeHandler()}
            style={{
              ...BaseStyle.container,
              justifyContent: 'flex-start',
              alignItems: 'center',
              alignSelf: 'flex-start',
            }}
            hitSlop={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Image
              source={
                allTime ? require('../images/ic_check_on.png') : require('../images/ic_check_off.png')
              }
              style={{width: 20, height: 20, ...BaseStyle.mr10}}
              resizeMode="cover"
            />
            <Text style={{...BaseStyle.ko14}}>24시간 운영</Text>
          </TouchableOpacity>
        </View> */}
        {/* // 24시간 운영 */}
      </ScrollView>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setStoreTimeHandler()}
        style={{...BaseStyle.mainBtnBottom}}>
        <Text style={{...BaseStyle.ko18, ...BaseStyle.font_bold, ...BaseStyle.font_white}}>
          저장하기
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SetTime;
