import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Api from '../Api';
import BaseStyle, { Primary } from '../styles/Base';
import moment from 'moment';
import 'moment/locale/ko';
import * as regHolidayAction from '../redux/actions/regularHolidayAction';

const StoreRegularHoliday = props => {
  const navigation = props.navigation;
  const { mt_id, mt_jumju_code } = useSelector(state => state.login);
  const { st_yoil, st_yoil_txt, st_week } = useSelector(state => state.regularHoliday);

  const [isLoading, setLoading] = React.useState(false);
  const [storeRHoliday, setStoreRHoliday] = React.useState(null); // 정기휴일

  const dispatch = useDispatch();

  const getStoreRegularHoliday = () => {
    setLoading(true);

    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'list',
    };
    Api.send('store_regular_hoilday', param, args => {
      const resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        // setStoreRHoliday(arrItems);
        dispatch(regHolidayAction.updateRegularHoliday(JSON.stringify(arrItems[0])));
        setLoading(false);
      } else {
        dispatch(
          regHolidayAction.updateRegularHoliday(
            JSON.stringify({
              st_yoil: null,
              st_yoil_txt: null,
              st_week: null,
            }),
          ),
        );
        setLoading(false);
      }
    });
  };

  const delStoreRegularHoliday = () => {
    const param = {
      encodeJson: true,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      mode: 'delete',
    };
    Api.send('store_regular_hoilday', param, args => {
      // let resultItem = args.resultItem;
      // let arrItems = args.arrItems;

      dispatch(
        regHolidayAction.updateRegularHoliday(
          JSON.stringify({
            st_yoil: null,
            st_yoil_txt: null,
            st_week: null,
          }),
        ),
      );
      getStoreRegularHoliday();
      // if (resultItem.result === 'Y') {
      //   getStoreRegularHoliday();
      // } else {
      //   Alert.alert('정기휴일을 삭제할 수 없습니다.', '다시 한번 확인해주세요.', [
      //     {
      //       text: '확인'
      //     }
      //   ]);
      // }
    });
  };

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      getStoreRegularHoliday();
    });
    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView>
      <View style={{ ...BaseStyle.pv15, backgroundColor: '#F8F8F8', ...BaseStyle.ph20 }}>
        <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold }}>정기휴일</Text>
      </View>
      {/*
      {isLoading ?
        <View style={{flex:1, ...BaseStyle.mv20 ,justifyContent:'center', alignItems:'center'}}>
          <ActivityIndicator size="large" color="#FCDD00" />
        </View>
        : */}
      <View style={{ ...BaseStyle.ph20, ...BaseStyle.mv15 }}>
        {/* 정기휴일 리스트 */}
        {st_week !== null && st_yoil_txt !== null ? (
          <View style={{ ...BaseStyle.container5, ...BaseStyle.mv10 }}>
            <View style={{ ...BaseStyle.container }}>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_bold, ...BaseStyle.mr10 }}>
                {st_week}
              </Text>
              <Text style={{ ...BaseStyle.ko14 }}>{st_yoil_txt}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() =>
                Alert.alert(
                  '해당 정기휴일을 삭제하시겠습니까?',
                  '삭제하시면 복구하실 수 없습니다.',
                  [
                    {
                      text: '예',
                      onPress: () => delStoreRegularHoliday(),
                    },
                    {
                      text: '아니오',
                    },
                  ],
                )
              }
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}>
              <Image
                source={require('../images/popup_close.png')}
                style={{ width: 18, height: 18, borderRadius: 18, opacity: 0.5 }}
                resizeMode="cover"
              />
            </TouchableOpacity>
          </View>
        ) : (
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              ...BaseStyle.mv15,
            }}>
            <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
              아직 등록된 정기휴일이 없습니다.
            </Text>
          </View>
        )}
        {/* // 정기휴일 리스트 */}
        {st_week !== null && st_yoil_txt !== null ? (
          <View style={{ ...BaseStyle.mainBtn, ...BaseStyle.mv10, backgroundColor: '#f5f5f5' }}>
            <Text
              style={{
                ...BaseStyle.ko15,
                ...BaseStyle.font_bold,
                ...BaseStyle.font_222,
              }}>
              정기휴일 추가완료
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => navigation.navigate('Home', { screen: 'SetClosed' })}
            style={{ ...BaseStyle.mainBtn, ...BaseStyle.mv10 }}>
            <Text
              style={{
                ...BaseStyle.ko15,
                ...BaseStyle.font_bold,
                ...BaseStyle.font_222,
                ...BaseStyle.textWhite,
              }}>
              정기휴일 추가
            </Text>
          </TouchableOpacity>
        )}
      </View>
      {/* } */}
    </SafeAreaView>
  );
};

export default StoreRegularHoliday;
