import React from 'react'
import { View, Text } from 'react-native'
import BaseStyle from '../../../styles/Base'
import Api from '../../../Api'

const OrderedMenus = props => {
  const { detailProduct } = props

  return (
    <View style={{ ...BaseStyle.mv15 }}>
      <Text style={{ ...BaseStyle.ko15, ...BaseStyle.font_bold, ...BaseStyle.mb15 }}>
        메뉴 정보
      </Text>

      {detailProduct.length > 0 &&
  detailProduct.map((menu, index) => (
    <View
      key={index}
      activeOpacity={1}
      style={{
        borderWidth: 1,
        borderColor: '#E3E3E3',
        borderRadius: 5,
        ...BaseStyle.ph15,
        ...BaseStyle.pv15,
        ...BaseStyle.mb10
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          ...BaseStyle.mb7
        }}
      >
        <Text
          style={{
            flex: 1,
            ...BaseStyle.ko16,
            ...BaseStyle.font_bold,
            ...BaseStyle.mr10,
            ...BaseStyle.mb7
          }}
        >
          {`${menu.it_name} ${menu.ct_qty}개`}
        </Text>
        <Text
          style={{ ...BaseStyle.ko16, ...BaseStyle.font_bold, ...BaseStyle.mb7 }}
        >
          {Api.comma(menu.sum_price)}원
        </Text>
      </View>
      <View
        style={{
          marginBottom:
            menu.cart_add_option && menu.cart_add_option.length > 0 ? 10 : 0
        }}
      >
        {menu.cart_option &&
          menu.cart_option.length > 0 &&
          menu.cart_option.map((defaultOption, key) => (
            <View
              key={`defaultOption-${key}`}
              style={{
                marginBottom:
                  key === menu.cart_option.length - 1 &&
                  menu.cart_add_option &&
                  menu.cart_add_option.length === 0
                    ? 0
                    : 10
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  ...BaseStyle.mb7,
                  flexWrap: 'wrap'
                }}
              >
                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                <Text
                  style={{
                    ...BaseStyle.ko14,
                    ...BaseStyle.font_222
                    // backgroundColor: Primary.PointColor01,
                    // color: '#222',
                  }}
                >
                  기본옵션 : {defaultOption.ct_option}
                </Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  ...BaseStyle.mb3,
                  flexWrap: 'wrap'
                }}
              >
                <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
                <Text style={{ ...BaseStyle.ko14, ...BaseStyle.font_222 }}>
                  옵션금액 : {Api.comma(defaultOption.io_price)}원
                </Text>
              </View>
            </View>
          ))}
      </View>
      {menu.cart_add_option &&
        menu.cart_add_option.length > 0 &&
        menu.cart_add_option.map((addOption, key) => (
          <View
            key={`addOption-${key}`}
            style={{
              marginBottom: key === menu.cart_add_option.length - 1 ? 0 : 10
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                ...BaseStyle.mb3,
                flexWrap: 'wrap'
              }}
            >
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>
                추가옵션 : {addOption.ct_option}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                ...BaseStyle.mb3,
                flexWrap: 'wrap'
              }}
            >
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>└ </Text>
              <Text style={{ ...BaseStyle.ko13, ...BaseStyle.font_222 }}>
                옵션금액 : {Api.comma(addOption.io_price)}원
              </Text>
            </View>
          </View>
        ))}
    </View>
  ))}
    </View>
  )
}

export default OrderedMenus
