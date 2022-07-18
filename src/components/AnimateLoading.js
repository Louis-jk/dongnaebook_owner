import React, {useState} from 'react';
import {View, Text, Animated, Easing} from 'react-native';

const AnimateLoading = ({description}) => {
  const Animation = useState(new Animated.Value(0))[0];

  Animated.loop(
    Animated.sequence([
      Animated.timing(Animation, {
        toValue: 100,
        duration: 500,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
      Animated.timing(Animation, {
        toValue: 0,
        duration: 500,
        // delay: 800,
        easing: Easing.ease,
        useNativeDriver: true,
      }),
    ]),
    {
      iterations: -1,
    },
  ).start();

  const interpolated = Animation.interpolate({
    inputRange: [0, 20, 40, 60, 80, 100],
    outputRange: ['0deg', '180deg', '270deg', '0deg', '-270deg', '-180deg'],
    extrapolateLeft: 'clamp',
  });

  const translate = Animation.interpolate({
    inputRange: [0, 20, 50],
    outputRange: [0, -10, -35],
    extrapolateLeft: 'clamp',
  });

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
      }}>
      <Animated.Image
        source={require('../images/logo_mark.png')}
        style={{
          width: 60,
          height: 60,
          marginBottom: 10,
          transform: [{rotate: interpolated} /*  {translateY: translate} */],
        }}
        resizeMode="cover"
      />

      {/* <ActivityIndicator size="large" color="#FCDC00" /> */}
      {/* <TouchableOpacity onPress={animationHandler}> */}
      <Text style={{fontSize: 20, fontWeight: 'bold'}}>{description}</Text>
      {/* </TouchableOpacity> */}
    </View>
  );
};

export default AnimateLoading;
