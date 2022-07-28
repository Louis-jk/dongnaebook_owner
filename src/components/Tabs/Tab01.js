import * as React from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Dimensions, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import moment from 'moment';
import 'moment/locale/ko';
import * as orderAction from '../../redux/actions/orderAction';
import Api from '../../Api';
import BaseStyle, { Primary } from '../../styles/Base';
import OrderCheckModal from '../OrderCheckModal';
import OrderRejectCancelModal from '../OrderRejectCancelModal';

// 신규주문
const Tab01 = props => {
  const { navigation, list, dispatch } = props;
  const { mt_id: jumjuId, mt_jumju_code: jumjuCode } = useSelector(state => state.login);
  const [orderId, setOrderId] = React.useState(''); // 주문 ID
  const [orderType, setOrderType] = React.useState(''); // 주문 Type
  const [refleshing, setReflashing] = React.useState(false);
  const { newOrder } = useSelector(state => state.order);

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [modalType, setModalType] = React.useState('');
  const toggleModal = payload => {
    setModalType(payload);
    setModalVisible(!isModalVisible);
  };

  // 주문 접수
  const [isOrderCheckModalVisible, setOrderCheckModalVisible] = React.useState(false);
  const toggleOrderCheckModal = () => {
    setOrderCheckModalVisible(!isOrderCheckModalVisible);
  };

  // 주문 건
  const [orderList, setOrderList] = React.useState([]);

  const getOrderListHandler = () => {
    const param = {
      encodeJson: true,
      item_count: 0,
      limit_count: 10,
      jumju_id: jumjuId,
      jumju_code: jumjuCode,
      od_process_status: '신규주문',
    };

    Api.send('store_order_list', param, args => {
      const resultItem = args.resultItem;
      const arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        setOrderList(arrItems);
        dispatch(orderAction.updateNewOrder(JSON.stringify(arrItems)));
        setReflashing(false);
      } else {
        setOrderList([]);
        dispatch(orderAction.updateNewOrder(null));
        setReflashing(false);
      }
    });
  };

  React.useEffect(() => {
    getOrderListHandler();
    return () => getOrderListHandler();
  }, []);

  React.useEffect(() => {
    const getMessage = messaging().onMessage(remoteMessage => {
      getOrderListHandler();
    });

    return () => getMessage();
  }, []);

  const onHandleRefresh = () => {
    setReflashing(true);
    getOrderListHandler();
  };

  const renderRow = ({ item, index }) => {
    console.log('tab01 item::', item);
    return (
      <View key={index}>
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
            style={{ width: '76%' }}
            onPress={() =>
              navigation.navigate('OrderDetail', {
                od_id: item.od_id,
                od_time: item.od_time,
                type: 'ready',
              })
            }>
            <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5 }}>
              {item.mb_company}
            </Text>
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
          <View>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id);
                setOrderType(item.od_type);
                toggleOrderCheckModal();
              }}
              style={{
                backgroundColor: Primary.PointColor02,
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                ...BaseStyle.round05,
                ...BaseStyle.pv10,
                ...BaseStyle.mb5,
              }}>
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
                접수
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => {
                setOrderId(item.od_id);
                toggleModal('reject');
              }}
              style={{
                backgroundColor: '#fff',
                width: 80,
                justifyContent: 'center',
                alignItems: 'center',
                ...BaseStyle.round05,
                ...BaseStyle.pv10,
                borderWidth: 1,
                borderColor: '#E3E3E3',
                ...BaseStyle.round05,
              }}>
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666 }}>
                주문거부
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {orderList && orderList.length > 0 && (
        <OrderCheckModal
          isModalVisible={isOrderCheckModalVisible}
          toggleModal={toggleOrderCheckModal}
          oderId={orderId}
          orderType={orderType}
          navigation={navigation}
        />
      )}
      <OrderRejectCancelModal
        navigation={navigation}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
        modalType={modalType}
        od_id={orderId}
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
              아직 신규 주문이 없습니다.
            </Text>
          </View>
        }
      />
    </View>
  );
};

export default Tab01;
