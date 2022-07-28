import * as React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  FlatList,
  Alert,
  BackHandler,
} from 'react-native';
import Header from '../components/SubHeader';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import Swipeout from 'react-native-swipeout-mod'; // 스와이프 기능(수정, 삭제)

// Local Modules
import BaseStyle, { Primary } from '../styles/Base';
import Api from '../Api';
import * as couponAction from '../redux/actions/couponAction';
import cusToast from '../components/CusToast';
import AnimateLoading from '../components/AnimateLoading';

const { width, height } = Dimensions.get('window');

const Coupon = props => {
  const { navigation } = props;
  const { mt_id, mt_jumju_code } = useSelector(state => state.login);
  const { coupons } = useSelector(state => state.coupon);
  const [useCoupon, setUseCoupon] = React.useState(false);
  const [isLoading, setLoading] = React.useState(true);

  const dispatch = useDispatch();

  // 안드로이드 뒤로가기 버튼 제어
  const backAction = () => {
    navigation.goBack();

    return true;
  };

  React.useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
  }, []);

  const [refleshing, setReflashing] = React.useState(false); // FlatList refleshing
  const [list, setList] = React.useState([]); // 쿠폰 리스트
  const [endCount, setEndCount] = React.useState(5); // 가져올 limit 아이템수

  const getCouponListHandler = () => {
    const param = {
      item_count: 0,
      limit_count: endCount,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
    };

    Api.send('store_couponzone_list', param, args => {
      const resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        console.log('쿠폰 리스트 :: ', arrItems);
        setList(arrItems);
        setEndCount(endCount + 5);
        dispatch(couponAction.updateCoupon(JSON.stringify(arrItems)));
        setReflashing(false);
      } else {
        dispatch(couponAction.updateCoupon(null));
        setList([]);
        setReflashing(false);
      }

      setLoading(false);
    });
  };

  const handleLoadMore = () => {
    getCouponListHandler();
  };

  React.useEffect(() => {
    getCouponListHandler();

    return () => getCouponListHandler();
  }, []);

  const onHandleRefresh = () => {
    setReflashing(true);
    getCouponListHandler();
  };

  const useCouponHandler = () => {
    setUseCoupon(!useCoupon);
  };

  const deleteCoupon = cz_no => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_no,
    };

    Api.send('store_couponzone_delete', param, args => {
      const resultItem = args.resultItem;
      let arrItems = args.arrItems;

      if (resultItem.result === 'Y') {
        getCouponListHandler();
        cusToast('쿠폰을 삭제하였습니다.');
      } else {
        Alert.alert('쿠폰을 삭제하지 못했습니다.', '관리자에게 문의하세요.', [
          {
            text: '확인',
          },
        ]);
      }
    });
  };

  const delCouponHandler = payload => {
    Alert.alert('해당 쿠폰을 삭제하시겠습니까?', '삭제하신 쿠폰은 복구가 불가능합니다.', [
      {
        text: '확인',
        onPress: () => deleteCoupon(payload),
      },
      {
        text: '취소',
      },
    ]);
  };

  const renderRow = ({ item, index }) => {
    const swipeBtns = [
      {
        text: '수정',
        component: (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../images/edit.png')}
              style={{ width: 20, height: 20, marginBottom: 10 }}
              resizeMode="center"
            />
            <Text style={{ ...BaseStyle.ko14 }}>수정</Text>
          </View>
        ),
        color: '#222',
        backgroundColor: Primary.PointColor03,
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () =>
          navigation.navigate('Home', { screen: 'CouponEdit', params: { item: item } }),
      },
      {
        text: '삭제',
        component: (
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              source={require('../images/delete_wh.png')}
              style={{ width: 20, height: 20, marginBottom: 10 }}
              resizeMode="center"
            />
            <Text style={{ ...BaseStyle.ko14, color: '#fff' }}>삭제</Text>
          </View>
        ),
        color: '#fff',
        backgroundColor: Primary.PointColor02,
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => delCouponHandler(item.cz_no),
      },
    ];

    return (
      <View style={{ position: 'relative' }}>
        <Swipeout
          right={swipeBtns}
          autoClose
          backgroundColor="transparent"
          style={{ height: 150, ...BaseStyle.mb15 }}>
          <View
            key={index + item.notice_id}
            // activeOpacity={1}
            // onPress={() =>
            //   navigation.navigate('Home', {screen: 'CouponEdit', params: {item: item}})
            // }
            style={{
              ...BaseStyle.mh20,
              ...BaseStyle.container5,
              borderWidth: 1,
              borderColor: '#E3E3E3',
              backgroundColor: '#E3E3E3',
              borderRadius: 5,
            }}>
            <View
              style={{
                width: '65%',
                ...BaseStyle.ph20,
                ...BaseStyle.pv20,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5,
              }}>
              <Text
                style={{
                  ...BaseStyle.ko24,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.font_222,
                  ...BaseStyle.mb5,
                }}>
                {`${Api.comma(item.cz_price)}${item.cz_price_type === '1' ? '%' : '원'}`}
              </Text>
              <View
                style={{
                  backgroundColor: Primary.PointColor02,
                  justifyContent: 'center',
                  alignItems: 'center',
                  borderRadius: 3,
                  ...BaseStyle.pv2,
                  ...BaseStyle.ph13,
                  ...BaseStyle.mb10,
                }}>
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>
                  {item.cz_subject}
                </Text>
              </View>
              <Text style={{ ...BaseStyle.ko14, ...BaseStyle.mb5, ...BaseStyle.font_222 }}>
                최소주문금액 {Api.comma(item.cz_minimum)}원
              </Text>
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_gray_a1 }}>
                {moment(item.cz_start).format('YYYY.MM.DD') +
                  '~' +
                  moment(item.cz_end).format('YYYY.MM.DD')}
              </Text>
            </View>
            <View style={{ width: 1, height: '100%', backgroundColor: '#E3E3E3' }} />
            <View
              style={{
                flex: 1,
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                ...BaseStyle.pv20,
                backgroundColor: '#fff',
                borderTopRightRadius: 5,
                borderBottomRightRadius: 5,
              }}>
              <Image
                source={require('../images/c_logo.png')}
                style={{ width: 65, height: 65 }}
                resizeMode="center"
              />
            </View>
          </View>
          {/* <TouchableOpacity
            activeOpacity={1}
            onPress={() => delCouponHandler(item.cz_no)}
            hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}
            style={{
              position: 'absolute',
              top: 0,
              right: 10,
              backgroundColor: Primary.PointColor01,
              borderRadius: 50,
              padding: 7,
            }}>
            <Image
              source={require('../images/pop_close.png')}
              style={{width: 13, height: 13}}
              resizeMode="cover"
            />
          </TouchableOpacity> */}
        </Swipeout>
      </View>
    );
  };

  return isLoading ? (
    <AnimateLoading description="잠시만 기다려주세요." />
  ) : (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title="쿠폰관리" />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Home', { screen: 'CouponAdd' })}
          style={{ ...BaseStyle.mainBtn, ...BaseStyle.pv13 }}>
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.font_white }}>
            쿠폰 추가하기 +
          </Text>
        </TouchableOpacity>
      </View>

      {/* 쿠폰 사용여부 위치 이동시 활성 필요 */}
      {/* <View style={{...BaseStyle.ph20, ...BaseStyle.container5}}>
        <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold}}>쿠폰 사용여부</Text>
        <View style={{height: 1, flex: 1, marginHorizontal: 18, backgroundColor: '#222'}} />
        <View style={{...BaseStyle.container}}>
          <View style={{...BaseStyle.mr10}}>
            <Text style={{...BaseStyle.ko15}}>{useCoupon ? '사용함' : '사용안함'}</Text>
          </View>
          <TouchableOpacity
            onPress={useCouponHandler}
            activeOpacity={1}
            style={{...BaseStyle.mr10, borderRadius: 20}}>
            <Image
              source={
                useCoupon ? require('../images/on_btn.png') : require('../images/off_btn.png')
              }
              style={{width: 50, height: 25, borderRadius: 20}}
              resizeMode="cover"
              fadeDuration={0}
            />
          </TouchableOpacity>
        </View>
      </View> */}
      {/* // 쿠폰 사용여부 */}

      {/* 쿠폰 안내 */}
      {coupons && coupons.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'center',
            ...BaseStyle.ph20,
            ...BaseStyle.mb10,
          }}>
          <View style={{ flexDirection: 'row', width: '80%' }}>
            <Text
              style={{
                ...BaseStyle.ko12,
                ...BaseStyle.lh17,
                color: Primary.PointColor02,
              }}>
              {'※ '}
            </Text>
            <Text
              style={{
                ...BaseStyle.ko12,
                ...BaseStyle.lh17,
                color: Primary.PointColor02,
              }}>
              {'쿠폰을 편집 또는 삭제하시려면\n해당 쿠폰을 오른쪽에서 왼쪽으로 스와이프해주세요.'}
            </Text>
          </View>
          <View style={{ width: '20%', justifyContent: 'center', alignItems: 'center' }}>
            <Image
              source={require('../images/swipe_m.png')}
              style={{ width: 100, height: 25 }}
              resizeMode="contain"
            />
          </View>
        </View>
      )}
      {/* // 쿠폰 안내 */}

      {/* 쿠폰 리스트 */}
      <View style={{ flex: 1, height }}>
        <FlatList
          data={coupons}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={refleshing}
          onRefresh={() => onHandleRefresh()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.6}
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
                아직 등록된 쿠폰이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      {/* //쿠폰 리스트 */}
    </View>
  );
};

export default Coupon;
