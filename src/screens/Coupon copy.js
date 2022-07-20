import * as React from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions, FlatList, Alert } from 'react-native';
import Header from '../components/SubHeader';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';
import 'moment/locale/ko';
import Swipeout from 'react-native-swipeout-mod';

// Local Modules
import BaseStyle, { Primary } from '../styles/Base';
import Api from '../Api';
import * as couponAction from '../redux/actions/couponAction';

const { width, height } = Dimensions.get('window')

const Coupon = props => {
  const { navigation } = props
  const { mt_id, mt_jumju_code } = useSelector(state => state.login)
  const { coupons } = useSelector(state => state.coupon)

  const dispatch = useDispatch()

  const [list, setList] = React.useState([])
  const [refleshing, setReflashing] = React.useState(false)

  const getCouponListHandler = () => {
    const param = {
      item_count: 0,
      limit_count: 10,
      jumju_id: mt_id,
      jumju_code: mt_jumju_code
    }

    Api.send('store_couponzone_list', param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        console.log('쿠폰 리스트 :: ', arrItems)
        setList(arrItems)
        dispatch(couponAction.updateCoupon(JSON.stringify(arrItems)))
        setReflashing(false)
      } else {
        dispatch(couponAction.updateCoupon(null))
        setList(null)
        setReflashing(false)
      }
    })
  };

  React.useEffect(() => {
    getCouponListHandler()
  }, [])

  const onHandleRefresh = () => {
    setReflashing(true)
    getCouponListHandler()
  };

  const deleteCoupon = cz_no => {
    const param = {
      jumju_id: mt_id,
      jumju_code: mt_jumju_code,
      cz_no
    }

    Api.send('store_couponzone_delete', param, args => {
      const resultItem = args.resultItem
      let arrItems = args.arrItems

      if (resultItem.result === 'Y') {
        getCouponListHandler()
      } else {
        Alert.alert('쿠폰을 삭제하지 못했습니다.', '관리자에게 문의하세요.', [
          {
            text: '확인'
          }
        ])
      }
    })
  };

  const delCouponHandler = payload => {
    Alert.alert('해당 쿠폰을 삭제하시겠습니까?', '삭제하신 쿠폰은 복구가 불가능합니다.', [
      {
        text: '확인',
        onPress: () => deleteCoupon(payload)
      },
      {
        text: '취소'
      }
    ])
  };

  const renderRow = ({ item, index }) => {
    const swipeBtns = [
      {
        text: '수정',
        backgroundColor: 'blue',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => navigation.navigate('Home', { screen: 'CouponEdit', params: { item: item } })
      },
      {
        text: '삭제',
        backgroundColor: 'red',
        underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
        onPress: () => delCouponHandler(item.cz_no)
      }
    ]

    return (
      <View style={{ position: 'relative' }}>
        <Swipeout right={swipeBtns} autoClose='true' backgroundColor='transparent'>
          <View
            key={index + item.notice_id}
            // activeOpacity={1}
            // onPress={() =>
            //   navigation.navigate('Home', {screen: 'CouponEdit', params: {item: item}})
            // }
            style={{
              ...BaseStyle.mv10,
              ...BaseStyle.mh20,
              ...BaseStyle.container5,
              borderWidth: 1,
              borderColor: '#E3E3E3',
              backgroundColor: '#E3E3E3',
              borderRadius: 5,
              ...BaseStyle.mb15,
              height: 140
            }}
          >
            <View
              style={{
                width: '65%',
                ...BaseStyle.ph20,
                ...BaseStyle.pv20,
                borderTopLeftRadius: 5,
                borderBottomLeftRadius: 5
              }}
            >
              <Text
                style={{
                  ...BaseStyle.ko24,
                  ...BaseStyle.font_bold,
                  ...BaseStyle.font_222,
                  ...BaseStyle.mb5
                }}
              >
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
                  ...BaseStyle.mb10
                }}
              >
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_white }}>{item.cz_subject}</Text>
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
                borderBottomRightRadius: 5
              }}
            >
              <Image
                source={require('../images/c_logo.png')}
                style={{ width: 65, height: 65 }}
                resizeMode='center'
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
    )
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Header navigation={navigation} title='쿠폰관리' />

      {/* <View style={{height:10, backgroundColor:'#F5F5F5'}} /> */}

      <View style={{ ...BaseStyle.ph20, ...BaseStyle.pv20 }}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => navigation.navigate('Home', { screen: 'CouponAdd' })}
          style={{ ...BaseStyle.mainBtn, ...BaseStyle.pv13 }}
        >
          <Text style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold }}>쿠폰 추가하기 +</Text>
        </TouchableOpacity>
      </View>

      {/* 쿠폰 사용여부 */}
      <View style={{ ...BaseStyle.ph20 }}>
        <Text>쿠폰 사용여부</Text>
      </View>
      {/* // 쿠폰 사용여부 */}

      {/* 쿠폰 안내 */}
      <View style={{ flexDirection: 'row', ...BaseStyle.ph20, ...BaseStyle.mb10 }}>
        <Text
          style={{
            ...BaseStyle.ko12,
            ...BaseStyle.lh17,
            color: Primary.PointColor02,
            ...BaseStyle.mt10
          }}
        >
          {'※ '}
        </Text>
        <Text
          style={{
            ...BaseStyle.ko12,
            ...BaseStyle.lh17,
            color: Primary.PointColor02,
            ...BaseStyle.mt10
          }}
        >
          쿠폰을 편집 또는 삭제하시려면 해당 쿠폰을 오른쪽에서 왼쪽으로 스와이프해주세요.
        </Text>
      </View>
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
          style={{ backgroundColor: '#fff', width: '100%' }}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                height: Dimensions.get('window').height - 300
              }}
            >
              <Text style={{ ...BaseStyle.ko15, textAlign: 'center' }}>
                아직 등록된 쿠폰이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
      {/* //쿠폰 리스트 */}
    </View>
  )
};

export default Coupon
