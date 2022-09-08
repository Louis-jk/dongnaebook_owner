import React, { useState } from 'react'
import { View, Text, Animated, Easing, Dimensions, Platform } from 'react-native'
import BaseStyle, {Primary} from '../../styles/Base'

const OrdersAnimateLoading = ({ description }) => {
  const Animation = useState(new Animated.Value(0))[0]

  Animated.loop(
    Animated.sequence([
      Animated.timing(Animation, {
        toValue: 100,
        duration: 350,
        easing: Easing.ease,
        useNativeDriver: true
      }),
      Animated.timing(Animation, {
        toValue: 0,
        duration: 400,
        // delay: 800,
        // easing: Easing.cubic,
        useNativeDriver: true
      })
    ]),
    {
      iterations: -1
    }
  ).start()

  const interpolated = Animation.interpolate({
    inputRange: [0, 20, 40, 60, 80, 100],
    outputRange: ['0deg', '180deg', '270deg', '0deg', '-270deg', '-180deg'],
    extrapolateLeft: 'clamp'
  })

  const interpolatedY = Animation.interpolate({
    inputRange: [0, 100],
    outputRange: [-3, 3],
    extrapolateLeft: 'clamp'
  })

  const translate = Animation.interpolate({
    inputRange: [0, 20, 50],
    outputRange: [0, -10, -35],
    extrapolateLeft: 'clamp'
  })

  return (
    <View
      style={{
        position: 'absolute',
        top: -40,
        right: 0,
        bottom: 0,
        left: 0,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}
    >
      <Animated.Image
        source={require('../../images/logo_s.png')}
        style={{
          width: 50,
          height: 50,
          opacity: 0.8,
          marginBottom: Platform.OS === 'android' ? 10 : -180,
          transform: [{ translateY: interpolatedY }]
        }}
        resizeMode='cover'
      />
      <Text style={{ ...BaseStyle.ko15, textAlign: 'center', color: Primary.PointColor01 }}>
        {description}
      </Text>
    </View>
  )
}

export default OrdersAnimateLoading
