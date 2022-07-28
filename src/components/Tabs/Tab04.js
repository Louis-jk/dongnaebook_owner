import * as React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import * as orderAction from '../../redux/actions/orderAction';
import Api from '../../Api';
import BaseStyle, { Primary } from '../../styles/Base';

// 처리완료
const Tab04 = props => {
  const { navigation, list, dispatch } = props;
  const { mt_id: jumjuId, mt_jumju_code: jumjuCode } = useSelector(state => state.login);
  const { doneOrder } = useSelector(state => state.order);

  console.log('포장완료', doneOrder);

  // 주문 건
  const [orderList, setOrderList] = React.useState([]);
  const [refleshing, setReflashing] = React.useState(false);

  const getOrderListHandler = () => {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: '배달완료',
    };

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setOrderList(arrItems);
        dispatch(orderAction.updateDoneOrder(JSON.stringify(arrItems)));
        setReflashing(false);
      } else {
        setOrderList([]);
        dispatch(orderAction.updateDoneOrder(null));
        setReflashing(false);
        // Alert.alert('데이터를 받아오는데 오류가 발생하였습니다.','관리자에게 문의해주세요.', [
        //   {
        //     text: '확인'
        //   }
        // ]);
      }
    });
  };

  React.useEffect(() => {
    getOrderListHandler();
    return () => getOrderListHandler();
  }, [doneOrder]);

  const onHandleRefresh = () => {
    setReflashing(true);
    getOrderListHandler();
  };

  const renderRow = ({ item, index }) => {
    return (
      <View key={item.od_id + index}>
        <View
          style={{
            backgroundColor: '#F8F8F8',
            width: '100%',
            ...BaseStyle.pv10,
            ...BaseStyle.ph20,
            ...BaseStyle.mb10,
          }}>
          <Text style={{ ...BaseStyle.ko12, ...BaseStyle.font_gray_a1 }}>
            {moment(item.od_time).format('YYYY년 M월 D일 HH:mm')}
          </Text>
        </View>
        <View style={{ ...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20 }}>
          <TouchableOpacity
            activeOpacity={1}
            style={{ width: '100%' }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'done',
              })
            }>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignContent: 'center',
                width: '100%',
                maxWidth: 270,
              }}>
              <Text
                style={{
                  ...BaseStyle.ko15,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.mr10,
                  lineHeight: 21,
                }}
                numberOfLines={1}>
                {item.mb_company}
              </Text>
              <View
                style={{
                  backgroundColor:
                    item.od_type === '배달' ? Primary.PointColor01 : Primary.PointColor02,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 5,
                }}>
                <Text
                  style={{
                    ...BaseStyle.ko12,
                    ...BaseStyle.font_bold,
                    color: '#fff',
                  }}>
                  {item.od_type}
                </Text>
              </View>
            </View>
            <Text style={{ ...BaseStyle.ko12, ...BaseStyle.mb3 }}>{item.od_good_name}</Text>
            <View style={{ ...BaseStyle.container }}>
              <Text
                style={[
                  { ...BaseStyle.ko12 },
                  item.od_settle_case === '선결제' ? BaseStyle.font_blue : BaseStyle.font_pink,
                ]}>
                {item.od_settle_case}
              </Text>
              <Text style={{ ...BaseStyle.ko12 }}> / </Text>
              <Text style={{ ...BaseStyle.ko12 }}>{Api.comma(item.od_receipt_price)}원</Text>
            </View>
            <View style={{ ...BaseStyle.container, ...BaseStyle.mt10 }}>
              <View
                style={{
                  borderWidth: 1,
                  borderColor: '#E3E3E3',
                  borderRadius: 50,
                  justifyContent: 'center',
                  alignItems: 'center',
                  width: 40,
                  height: 40,
                  ...BaseStyle.mr10,
                }}>
                <Image
                  source={require('../../images/ic_map.png')}
                  style={{ width: '100%', height: '100%' }}
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
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>{item.od_addr3}</Text>
                ) : null}
                {item.od_addr_jibeon ? (
                  <Text style={{ ...BaseStyle.ko12, ...BaseStyle.lh17 }}>
                    {item.od_addr_jibeon}
                  </Text>
                ) : null}
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
        style={{ backgroundColor: '#fff', width: '100%' }}
        ListEmptyComponent={
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
              height: Dimensions.get('window').height - 300,
            }}>
            <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
              아직 배달완료된 주문이 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Tab04;
