import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  useWindowDimensions,
  FlatList,
  Image,
} from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import {TabView, SceneMap} from 'react-native-tab-view';
import BaseStyle, {Primary} from '../styles/Base';
import OrderRejectCancelModal from './OrderRejectCancelModal';
import {s01_list, s02_list, s03_list} from '../data/status';

const {width, height} = Dimensions.get('window');

const StatusMenu = props => {
  const {navigation} = props;

  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(null);
  const [items, setItems] = React.useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'},
  ]);

  // 주문 거부
  const [isModalVisible, setModalVisible] = React.useState(false);
  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  // TabView start
  const Menu01 = props => {
    const {navigation} = props;

    const renderRow = ({item, index}) => {
      return (
        <View>
          <View
            style={{
              backgroundColor: '#F8F8F8',
              width: '100%',
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}>
            <Text style={{...BaseStyle.ko12, ...BaseStyle.font_gray_a1}}>{item.order}</Text>
          </View>
          <View style={{...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('OrderDetail', {detail: item, type: 'ready'})}>
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5}}>
                {item.store}
              </Text>
              <Text style={{...BaseStyle.ko12, ...BaseStyle.mb3}}>
                {item.orderMenu[0].title}{' '}
                {item.orderMenu.length > 1 ? `외 ${item.orderMenu.length - 1}개` : null}
              </Text>
              <View style={{...BaseStyle.container}}>
                <Text
                  style={[
                    {...BaseStyle.ko12},
                    item.payment ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}>
                  {item.payment ? '선결제' : '후불'}
                </Text>
                <Text style={{...BaseStyle.ko12}}> / </Text>
                <Text style={{...BaseStyle.ko12}}>{item.orderPrice}원</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mt10}}>
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
                    source={require('../images/ic_map.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a01}</Text>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a02}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => alert('접수되었습니다.')}
                style={{
                  backgroundColor: '#58BC1F',
                  width: 80,
                  justifyContent: 'center',
                  alignItems: 'center',
                  ...BaseStyle.round05,
                  ...BaseStyle.pv10,
                  ...BaseStyle.mb5,
                }}>
                <Text style={{...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_white}}>
                  접수
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={toggleModal}
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
                <Text style={{...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666}}>
                  주문거부
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={s01_list}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar={true}
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={true}
          style={{backgroundColor: '#fff', width: '100%'}}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                // height: Dimensions.get('window').height - 300,
              }}>
              <Text style={{...BaseStyle.ko15, textAlign: 'center'}}>
                아직 처리된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    );
  };
  const Menu02 = props => {
    const {navigation} = props;

    const renderRow = ({item, index}) => {
      return (
        <View>
          <View
            style={{
              backgroundColor: '#F8F8F8',
              width: '100%',
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}>
            <Text style={{...BaseStyle.ko12, ...BaseStyle.font_gray_a1}}>{item.order}</Text>
          </View>
          <View style={{...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('OrderDetail', {detail: item, type: 'doing'})}>
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5}}>
                {item.store}
              </Text>
              <Text style={{...BaseStyle.ko12, ...BaseStyle.mb3}}>
                {item.orderMenu[0].title}{' '}
                {item.orderMenu.length > 1 ? `외 ${item.orderMenu.length - 1}개` : null}
              </Text>
              <View style={{...BaseStyle.container}}>
                <Text
                  style={[
                    {...BaseStyle.ko12},
                    item.payment ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}>
                  {item.payment ? '선결제' : '후불'}
                </Text>
                <Text style={{...BaseStyle.ko12}}> / </Text>
                <Text style={{...BaseStyle.ko12}}>{item.orderPrice}원</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mt10}}>
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
                    source={require('../images/ic_map.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a01}</Text>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a02}</Text>
                </View>
              </View>
            </TouchableOpacity>
            <View>
              <TouchableOpacity
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
                <Text style={{...BaseStyle.ko13, ...BaseStyle.font_bold, ...BaseStyle.font_666}}>
                  주문취소
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={s02_list}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar={true}
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={true}
          style={{backgroundColor: '#fff', width: '100%'}}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                // height: Dimensions.get('window').height - 300,
              }}>
              <Text style={{...BaseStyle.ko15, textAlign: 'center'}}>
                아직 처리된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    );
  };
  const Menu03 = props => {
    const {navigation} = props;

    const renderRow = ({item, index}) => {
      return (
        <View>
          <View
            style={{
              backgroundColor: '#F8F8F8',
              width: '100%',
              ...BaseStyle.pv10,
              ...BaseStyle.ph20,
              ...BaseStyle.mb10,
            }}>
            <Text style={{...BaseStyle.ko12, ...BaseStyle.font_gray_a1}}>{item.order}</Text>
          </View>
          <View style={{...BaseStyle.container6, ...BaseStyle.mb20, ...BaseStyle.ph20}}>
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => navigation.navigate('OrderDetail', {detail: item, type: 'done'})}>
              <Text style={{...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb5}}>
                {item.store}
              </Text>
              <Text style={{...BaseStyle.ko12, ...BaseStyle.mb3}}>
                {item.orderMenu[0].title}{' '}
                {item.orderMenu.length > 1 ? `외 ${item.orderMenu.length - 1}개` : null}
              </Text>
              <View style={{...BaseStyle.container}}>
                <Text
                  style={[
                    {...BaseStyle.ko12},
                    item.payment ? BaseStyle.font_blue : BaseStyle.font_pink,
                  ]}>
                  {item.payment ? '선결제' : '후불'}
                </Text>
                <Text style={{...BaseStyle.ko12}}> / </Text>
                <Text style={{...BaseStyle.ko12}}>{item.orderPrice}원</Text>
              </View>
              <View style={{...BaseStyle.container, ...BaseStyle.mt10}}>
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
                    source={require('../images/ic_map.png')}
                    style={{width: '100%', height: '100%'}}
                    resizeMode="center"
                  />
                </View>
                <View>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a01}</Text>
                  <Text style={{...BaseStyle.ko12, ...BaseStyle.lh17}}>{item.address.a02}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    };

    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <FlatList
          data={s03_list}
          renderItem={renderRow}
          keyExtractor={(list, index) => index.toString()}
          // pagingEnabled={true}
          persistentScrollbar={true}
          showsVerticalScrollIndicator={false}
          // progressViewOffset={true}
          refreshing={true}
          style={{backgroundColor: '#fff', width: '100%'}}
          ListEmptyComponent={
            <View
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                flex: 1,
                // height: Dimensions.get('window').height - 300,
              }}>
              <Text style={{...BaseStyle.ko15, textAlign: 'center'}}>
                아직 처리된 주문이 없습니다.
              </Text>
            </View>
          }
        />
      </View>
    );
  };

  const initialLayout = {width: Dimensions.get('window').width};
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);
  const [tabIndex, setTabIndex] = React.useState('menu01');

  const [routes] = React.useState([
    {key: 'menu01', title: '메뉴01'},
    {key: 'menu02', title: '메뉴02'},
    {key: 'menu03', title: '메뉴03'},
  ]);

  const renderScene = ({route}) => {
    switch (route.key) {
    case 'menu01':
      return <Menu01 navigation={navigation} />;
    case 'menu02':
      return <Menu02 navigation={navigation} />;
    case 'menu03':
      return <Menu03 navigation={navigation} />;
    }
  };

  const TabBar = props => {
    const {tabIndex, jumpTo} = props;

    return (
      <View style={{...BaseStyle.container0, ...BaseStyle.mv10}}>
        <TouchableOpacity
          activeOpacity={1}
          onPress={async () => {
            await jumpTo('menu01');
            await setTabIndex('menu01');
          }}
          style={{
            borderWidth: 1,
            borderColor: index === 0 ? Primary.PointColor01 : '#E3E3E3',
            borderRadius: 25,
            ...BaseStyle.pv10,
            width: '27%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: index === 0 ? Primary.PointColor01 : '#fff',
            ...BaseStyle.mr5,
          }}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
          <Text style={{...BaseStyle.ko14, color: index === 0 ? '#222' : '#888888'}}>
            접수
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={async () => {
            await jumpTo('menu02');
            await setTabIndex('menu02');
          }}
          style={{
            borderWidth: 1,
            borderColor: index === 1 ? Primary.PointColor01 : '#E3E3E3',
            borderRadius: 25,
            ...BaseStyle.pv10,
            width: '27%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: index === 1 ? Primary.PointColor01 : '#fff',
            ...BaseStyle.mr5,
          }}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
          <Text style={{...BaseStyle.ko14, color: index === 1 ? '#222' : '#888888'}}>
            처리중
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={1}
          onPress={async () => {
            await jumpTo('menu03');
            await setTabIndex('menu03');
          }}
          style={{
            borderWidth: 1,
            borderColor: index === 2 ? Primary.PointColor01 : '#E3E3E3',
            borderRadius: 25,
            ...BaseStyle.pv10,
            width: '27%',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: index === 2 ? Primary.PointColor01 : '#fff',
          }}
          hitSlop={{top: 10, right: 10, bottom: 10, left: 10}}>
          <Text style={{...BaseStyle.ko14, color: index === 2 ? '#222' : '#888888'}}>
            완료
          </Text>
        </TouchableOpacity>
      </View>
    );
  };
  // TabView end

  return (
    <View style={{flex: 1}}>
      <OrderRejectCancelModal
        navigation={navigation}
        isModalVisible={isModalVisible}
        toggleModal={toggleModal}
      />

      {/* TabView */}
      {/* Status(접수, 처리중, 완료) */}
      <View style={{flex: 1, width: '100%'}}>
        <TabView
          renderTabBar={props => (
            <TabBar
              {...props}
              navigation={navigation}
              setTabIndex={setTabIndex}
              tabIndex={tabIndex}
              onIndexChange={setIndex}
            />
          )}
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          swipeEnabled
        />
      </View>
      {/* // Status(접수, 처리중, 완료) */}
      {/* // TabView */}
    </View>
  );
};

export default StatusMenu;
