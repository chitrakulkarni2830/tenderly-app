import { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

const AnimatedIcon = ({ outlineSource, filledSource, iconName, activeIcon, onPress }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: activeIcon === iconName ? 1 : 0,
      duration: 250, // Smooth 250ms fade
      useNativeDriver: true,
    }).start();
  }, [activeIcon]);

  return (
    <TouchableOpacity 
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      onPress={() => onPress(iconName)}
    >
      <View style={styles.iconWrapper}>
        <Image 
          source={outlineSource} 
          style={styles.customIcon} 
          resizeMode="contain" 
        />
        <Animated.Image 
          source={filledSource} 
          style={[styles.customIcon, styles.filledIcon, { opacity: fadeAnim }]} 
          resizeMode="contain" 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  const [activeIcon, setActiveIcon] = useState(null);
  const timeoutRef = useRef(null);
  const heartLottieRef = useRef(null);
  const waterLottieRef = useRef(null);
  const sunshineLottieRef = useRef(null);
  const nourishLottieRef = useRef(null);

  const handleIconPress = (iconName) => {
    setActiveIcon(iconName);
    
    if (iconName === 'heart') {
      heartLottieRef.current?.reset();
      heartLottieRef.current?.play();
    } else if (iconName === 'drop') {
      waterLottieRef.current?.reset();
      waterLottieRef.current?.play();
    } else if (iconName === 'sun') {
      sunshineLottieRef.current?.reset();
      sunshineLottieRef.current?.play();
    } else if (iconName === 'sparkles') {
      nourishLottieRef.current?.reset();
      nourishLottieRef.current?.play();
    }
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setActiveIcon(null);
    }, 1000); // Stays active for 1 second
  };
  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Feather name="menu" size={24} color="#3E342D" />
        </TouchableOpacity>
        
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="musical-note" size={24} color="#3E342D" />
        </TouchableOpacity>
        
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
          <Ionicons name="settings-outline" size={24} color="#3E342D" />
        </TouchableOpacity>
      </View>

      {/* Greeting Text */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>“Oh! A new friend 🫶🏻🌱”</Text>
      </View>

      {/* Main Clover Image Container */}
      <View style={styles.imageContainer}>
        {/* Animations Layer (Positioned behind clover, visible rising above and around it) */}
        <View style={styles.lottieContainer} pointerEvents="none">
          {/* Heart / Love Animation */}
          <View style={[styles.lottieWrapper, { opacity: activeIcon === 'heart' ? 1 : 0 }]}>
            <LottieView
              ref={heartLottieRef}
              source={require('../assets/animations/heart_animation.json')}
              style={styles.heartLottie}
              autoPlay={false}
              loop={false}
            />
          </View>

          {/* Water Plip Animation */}
          <View style={[styles.lottieWrapper, { opacity: activeIcon === 'drop' ? 1 : 0 }]}>
            <LottieView
              ref={waterLottieRef}
              source={require('../assets/animations/water_animation.json')}
              style={styles.waterLottie}
              autoPlay={false}
              loop={false}
            />
          </View>

          {/* Sunshine Sparkles Animation (for Sun icon) */}
          <View style={[styles.lottieWrapper, { opacity: activeIcon === 'sun' ? 1 : 0 }]}>
            <LottieView
              ref={sunshineLottieRef}
              source={require('../assets/animations/sparkles_animation.json')}
              style={styles.sparklesLottie}
              autoPlay={false}
              loop={false}
            />
          </View>

          {/* Nourishment Leaves Animation (for Nourish / Sparkles icon) */}
          <View style={[styles.lottieWrapper, { opacity: activeIcon === 'sparkles' ? 1 : 0 }]}>
            <LottieView
              ref={nourishLottieRef}
              source={require('../assets/animations/nourish_animation.json')}
              style={styles.nourishLottie}
              autoPlay={false}
              loop={false}
            />
          </View>
        </View>

        {/* Clover Plant in Foreground */}
        <Image 
          source={require('../assets/images/clover_pot.png')} 
          style={styles.cloverImage}
          resizeMode="contain"
        />
      </View>

      {/* Action Icons Row */}
      <View style={styles.actionRow}>
        <AnimatedIcon 
          iconName="heart"
          activeIcon={activeIcon}
          onPress={handleIconPress}
          outlineSource={require('../assets/images/icon_heart.png')}
          filledSource={require('../assets/images/icon_heart_filled.png')}
        />
        <AnimatedIcon 
          iconName="drop"
          activeIcon={activeIcon}
          onPress={handleIconPress}
          outlineSource={require('../assets/images/icon_drop.png')}
          filledSource={require('../assets/images/icon_drop_filled.png')}
        />
        <AnimatedIcon 
          iconName="sun"
          activeIcon={activeIcon}
          onPress={handleIconPress}
          outlineSource={require('../assets/images/icon_sun.png')}
          filledSource={require('../assets/images/icon_sun_filled.png')}
        />
        <AnimatedIcon 
          iconName="sparkles"
          activeIcon={activeIcon}
          onPress={handleIconPress}
          outlineSource={require('../assets/images/icon_sparkles.png')}
          filledSource={require('../assets/images/icon_sparkles_filled.png')}
        />
      </View>

      {/* Whisper Text Section */}
      <View style={styles.whisperContainer}>
        <Text style={styles.whisperSubtitle}>a little whisper ✨</Text>
        <Text style={styles.whisperText}>You are allowed to</Text>
        <Text style={styles.whisperText}>have a slow day 🫶🏻</Text>
      </View>
      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F2EC', // Cream background
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  navRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 40,
    paddingTop: 15,
  },
  greetingContainer: {
    alignItems: 'center',
    marginTop: 30,
  },
  greetingText: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: '#4A5D4E',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 20,
    marginBottom: 20,
    position: 'relative',
  },
  lottieContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  lottieWrapper: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  heartLottie: {
    width: 320,
    height: 320,
    transform: [{ translateY: -70 }, { scale: 1.6 }],
  },
  waterLottie: {
    width: 320,
    height: 320,
    transform: [{ translateY: -60 }, { scale: 1.5 }],
  },
  nourishLottie: {
    width: 320,
    height: 320,
    transform: [{ translateY: -65 }, { scale: 1.5 }],
  },
  sparklesLottie: {
    width: 320,
    height: 320,
    transform: [{ translateY: -15 }, { scale: 1.35 }],
  },
  cloverImage: {
    width: 250,
    height: 250,
    zIndex: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginBottom: 60,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    position: 'relative',
  },
  customIcon: {
    width: 40,
    height: 40,
    position: 'absolute',
    top: 0,
    left: 0,
  },
  filledIcon: {
    zIndex: 2,
  },
  whisperContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  whisperSubtitle: {
    fontFamily: 'Amarna',
    fontSize: 16,
    color: '#8A9589',
    marginBottom: 10,
  },
  whisperText: {
    fontFamily: 'Amarna',
    fontSize: 24,
    color: '#4A5D4E',
    textAlign: 'center',
    lineHeight: 34,
  }
});
