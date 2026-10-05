import { useEffect, useRef, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  KeyboardAvoidingView, 
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

const { height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Animation Values
  const masterOpacity = useRef(new Animated.Value(0)).current;
  const subtitleOpacity = useRef(new Animated.Value(1)).current;
  // Start translateY at center of screen. Target is 0 (top)
  const logoTranslateY = useRef(new Animated.Value(height / 2 - 120)).current; 
  const onboardingOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Keyboard listeners
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => setKeyboardVisible(true)
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      () => setKeyboardVisible(false)
    );

    // 1. Fade in the whole splash screen initially
    Animated.timing(masterOpacity, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();

    // 2. Wait 2.5 seconds, then transition to Onboarding smoothly
    const transitionTimer = setTimeout(() => {
      Animated.sequence([
        // Fade out subtitle
        Animated.timing(subtitleOpacity, {
          toValue: 0,
          duration: 400,
          useNativeDriver: true,
        }),
        // Move Tenderly up AND fade in onboarding content simultaneously
        Animated.parallel([
          Animated.timing(logoTranslateY, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(onboardingOpacity, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
            delay: 200 // Slight delay so logo moves a bit before content appears
          })
        ])
      ]).start();
    }, 2500);

    return () => {
      clearTimeout(transitionTimer);
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleContinue = () => {
    if (name.trim()) {
      setIsSubmitting(true);
      // Wait a moment for the inversion effect before navigating
      setTimeout(() => {
        router.replace({ pathname: '/welcome', params: { name: name.trim() } });
      }, 300);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.container}
        >
          {/* Main App Fade In */}
          <Animated.View style={[styles.mainWrapper, { opacity: masterOpacity }]}>
            
            {/* Absolutely Positioned Logo & Subtitle */}
            <Animated.View 
              style={[
                styles.logoContainer, 
                { transform: [{ translateY: logoTranslateY }] }
              ]}
              pointerEvents="none"
            >
              <Text style={styles.logo}>Tenderly</Text>
              <Animated.Text style={[styles.subtitle, { opacity: subtitleOpacity }]}>
                take care of me to take care of you
              </Animated.Text>
            </Animated.View>

            {/* Onboarding Content (Fades in later) */}
            <Animated.View 
              style={[
                styles.onboardingContainer, 
                { opacity: onboardingOpacity },
                isKeyboardVisible && { justifyContent: 'center', paddingBottom: 0 }
              ]}
              pointerEvents="box-none"
            >
              {/* Spacer to push content below the logo */}
              {!isKeyboardVisible && <View style={styles.logoSpacer} />}

              {/* Clover Image */}
              {!isKeyboardVisible && (
                <View style={styles.imageContainer}>
                  <Image 
                    source={require('../assets/images/clover.png')} 
                    style={styles.image}
                    resizeMode="contain"
                  />
                </View>
              )}

              {/* Welcome Text */}
              {!isKeyboardVisible && (
                <View style={styles.textContainer}>
                  <Text style={styles.greeting}>Hi, I'm Clover</Text>
                  <Text style={styles.question}>What should I call you?</Text>
                </View>
              )}

              {/* Input Area */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="name"
                  placeholderTextColor="#A0ACA3"
                  value={name}
                  onChangeText={setName}
                  autoCorrect={false}
                  returnKeyType="done"
                />
                
                <TouchableOpacity 
                  style={[
                    styles.button, 
                    !name.trim() && styles.buttonDisabled,
                    isSubmitting && styles.buttonInverted
                  ]} 
                  onPress={handleContinue}
                  activeOpacity={0.9}
                  disabled={!name.trim() || isSubmitting}
                >
                  <Text style={[
                    styles.buttonText, 
                    !name.trim() && styles.buttonTextDisabled,
                    isSubmitting && styles.buttonTextInverted
                  ]}>
                    CONTINUE
                  </Text>
                </TouchableOpacity>
              </View>
            </Animated.View>

          </Animated.View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F5F2EC',
  },
  container: {
    flex: 1,
  },
  mainWrapper: {
    flex: 1,
  },
  logoContainer: {
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  logo: {
    fontFamily: 'Billabong',
    fontSize: 56,
    color: '#4A5D4E',
  },
  subtitle: {
    fontFamily: 'Amarna',
    fontSize: 14,
    fontWeight: '400',
    color: '#7C8A7F',
    fontStyle: 'italic',
    marginTop: 12,
  },
  onboardingContainer: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 30,
    justifyContent: 'space-between',
    paddingBottom: 40,
  },
  logoSpacer: {
    height: 100, // Provides empty space at the top where the logo sits
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxHeight: 280,
  },
  image: {
    width: 200,
    height: 250,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  greeting: {
    fontFamily: 'Amarna',
    fontSize: 32,
    color: '#4A5D4E',
    fontWeight: '400',
    marginBottom: 8,
  },
  question: {
    fontFamily: 'Amarna',
    fontSize: 32,
    color: '#4A5D4E',
    fontWeight: '400',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    fontFamily: 'Amarna',
    width: '80%',
    height: 50,
    borderWidth: 1.5,
    borderColor: '#4A5D4E',
    borderRadius: 25,
    paddingHorizontal: 20,
    fontSize: 22,
    color: '#4A5D4E',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    width: '80%',
    height: 50,
    borderWidth: 1.5,
    borderColor: '#4A5D4E',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: {
    borderColor: '#A0ACA3',
    opacity: 0.6,
  },
  buttonInverted: {
    backgroundColor: '#4A5D4E',
  },
  buttonText: {
    fontFamily: 'Amarna',
    color: '#4A5D4E',
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: 1,
  },
  buttonTextDisabled: {
    color: '#A0ACA3',
  },
  buttonTextInverted: {
    color: '#F5F2EC',
  }
});
