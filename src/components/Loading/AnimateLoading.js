import React, { useState } from 'react'
import { View, Text, Animated, Easing } from 'react-native'
import BaseStyle from '../../styles/Base'

const AnimateLoading = ({ description }) => {
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
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff'
      }}
    >
      <Animated.Image
        source={require('../../images/logo_mark.png')}
        style={{
          width: 80,
          height: 80,
          marginBottom: 20,
          // transform: [{rotate: interpolated} /*  {translateY: translate} */],
          transform: [{ translateY: interpolatedY }]
        }}
        resizeMode='cover'
      />
      <Text style={{ fontSize: 14, ...BaseStyle.font_666, ...BaseStyle.font_main }}>
        {description}
      </Text>
    </View>
  )
}

export default AnimateLoading
