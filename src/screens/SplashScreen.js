import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  Easing,
} from 'react-native';
import colors from '../constants/colors';
import globalStyles from '../constants/styles';

const SplashScreen = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.5);
  const rotateAnim = new Animated.Value(0);

  useEffect(() => {
    // Fade in animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
        easing: Easing.ease,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Navigate after 2.5 seconds
    setTimeout(() => {
      navigation.replace('Login');
    }, 2500);
  }, []);

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[globalStyles.containerCenter, { backgroundColor: colors.primary }]}>
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { rotate: rotateInterpolate }],
          alignItems: 'center',
        }}
      >
        {/* Mango Icon / Logo */}
        <View style={{ width: 120, height: 120, borderRadius: 60, backgroundColor: colors.white, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ fontSize: 60 }}>🥭</Text>
        </View>
        
        {/* App Name */}
        <Animated.Text
          style={[
            globalStyles.title,
            {
              color: colors.white,
              marginTop: 20,
              fontSize: 28,
              opacity: fadeAnim,
            },
          ]}
        >
          Mango Admin
        </Animated.Text>
        
        <Animated.Text
          style={[
            globalStyles.caption,
            {
              color: colors.white,
              marginTop: 8,
              opacity: fadeAnim,
            },
          ]}
        >
          Dynamic Product Management
        </Animated.Text>
      </Animated.View>
      
      {/* Loading indicator */}
      <View style={{ position: 'absolute', bottom: 50 }}>
        <Text style={{ color: colors.white, fontSize: 12 }}>
          Loading...
        </Text>
      </View>
    </View>
  );
};

export default SplashScreen;