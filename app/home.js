import { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Animated, Modal, AppState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import LottieView from 'lottie-react-native';
import { StorageService, getGrowthStage } from '../services/storage';
import { isBlossomReady, selectNextFlower, FLOWER_METADATA } from '../services/garden';
import { useAudio } from '../contexts/AudioContext';
import { useTheme } from '../contexts/ThemeContext';

const CLOVER_STAGE_IMAGES = {
  1: require('../assets/images/clover_pot.png'),      // Sprout
  2: require('../assets/images/clover_young.png'),    // Young
  3: require('../assets/images/clover_grown.png'),    // Grown
  4: require('../assets/images/clover_budding.png'),  // Budding
  5: require('../assets/images/clover_blossomed.png'),// Blossomed
};

const AnimatedIcon = ({ outlineSource, filledSource, iconName, activeIcon, onPress }) => {
  const { theme } = useTheme();
  const styles = getStyles(theme);
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
          style={[styles.customIcon, { tintColor: theme.text }]} 
          resizeMode="contain" 
        />
        <Animated.Image 
          source={filledSource} 
          style={[styles.customIcon, styles.filledIcon, { opacity: fadeAnim, tintColor: theme.text }]} 
          resizeMode="contain" 
        />
      </View>
    </TouchableOpacity>
  );
};

export default function Home() {
  const router = useRouter();
  const { theme, currentThemeId, changeTheme } = useTheme();
  const styles = getStyles(theme);
  const { isPlaying, togglePlayPause, playNextTrack, playPreviousTrack } = useAudio();
  const [activeIcon, setActiveIcon] = useState(null);
  const [careCount, setCareCount] = useState(0);
  const [pendingFlower, setPendingFlower] = useState(null);
  const [showBlossomModal, setShowBlossomModal] = useState(false);
  const [showAudioControls, setShowAudioControls] = useState(false);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [currentWhisper, setCurrentWhisper] = useState('You are allowed to\nhave a slow day 🫶🏻');
  const [dailyMessages, setDailyMessages] = useState(null);
  const [cloverSpeech, setCloverSpeech] = useState(null);
  const [isSpeechVisible, setIsSpeechVisible] = useState(false);
  const [userName, setUserName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadName = async () => {
        const settings = await StorageService.loadUserSettings();
        if (settings && settings.name) {
          setUserName(settings.name);
        } else {
          setUserName('');
        }
      };
      loadName();
    }, [])
  );

  const timeoutRef = useRef(null);
  const speechTimeoutRef = useRef(null);
  const heartLottieRef = useRef(null);
  const waterLottieRef = useRef(null);
  const sunshineLottieRef = useRef(null);
  const nourishLottieRef = useRef(null);

  // Floating bounce animation for the blossom note
  const noteFloatAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const floatLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(noteFloatAnim, {
          toValue: -6,
          duration: 1600,
          useNativeDriver: true,
        }),
        Animated.timing(noteFloatAnim, {
          toValue: 0,
          duration: 1600,
          useNativeDriver: true,
        }),
      ])
    );
    floatLoop.start();
    return () => floatLoop.stop();
  }, []);

  // Restore persisted Clover care count & growth stage on app launch
  useEffect(() => {
    let isMounted = true;
    StorageService.loadCloverState().then((state) => {
      if (isMounted && state && typeof state.careCount === 'number') {
        setCareCount(state.careCount);
        if (state.pendingFlower) {
          setPendingFlower(state.pendingFlower);
        }
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);
  
  // Load whisper on mount
  useEffect(() => {
    const initializeWhisper = async () => {
      let state = await StorageService.loadWhisperState();
      const allWhispers = require('../data/whispers.json');
      
      const today = new Date().toDateString(); // e.g., "Mon Oct 05 2026"
      let needsAdvance = false;
      
      // If we haven't seen a whisper today, we need to advance the index
      if (state.lastShownDate !== today) {
        needsAdvance = true;
      }
      
      // If we don't have a sequence, OR we need to advance but we're at the end of the sequence
      if (!state.sequence || state.sequence.length === 0 || (needsAdvance && state.currentIndex + 1 >= state.sequence.length)) {
        // Generate a new shuffled sequence
        const newSequence = [...allWhispers];
        for (let i = newSequence.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newSequence[i], newSequence[j]] = [newSequence[j], newSequence[i]];
        }
        
        // Ensure the first item of the new sequence is not the same as the last item of the old sequence
        if (state.sequence && state.sequence.length > 0) {
          const lastWhisper = state.sequence[state.sequence.length - 1];
          if (newSequence[0] === lastWhisper && newSequence.length > 1) {
            [newSequence[0], newSequence[1]] = [newSequence[1], newSequence[0]];
          }
        }
        
        // Start fresh with the new sequence for today
        state = { sequence: newSequence, currentIndex: 0, lastShownDate: today };
        needsAdvance = false; 
      }
      
      // Advance to the next whisper if it's a new day (and we didn't just generate a new sequence)
      if (needsAdvance && state.sequence.length > 0) {
        state.currentIndex += 1;
        state.lastShownDate = today;
      }
      
      setCurrentWhisper(state.sequence[state.currentIndex]);
      await StorageService.saveWhisperState(state);
    };
    
    initializeWhisper();
  }, []);

  // Handle blossoming logic when threshold (21 care actions) is reached
  useEffect(() => {
    if (isBlossomReady(careCount) && !pendingFlower) {
      StorageService.loadGardenFlowers().then((history) => {
        const nextFlower = selectNextFlower(history);
        setPendingFlower(nextFlower);
        StorageService.saveCloverState(careCount, { pendingFlower: nextFlower });
      });
    }
  }, [careCount, pendingFlower]);

  // Load and manage daily messages
  useEffect(() => {
    let isMounted = true;
    let intervalId = null;
    
    const initDailyMessages = async () => {
      let state = await StorageService.loadDailyMessagesState();
      const today = new Date().toDateString();
      
      if (!state || state.date !== today) {
        state = {
          date: today,
          selections: {
            water: { index: Math.floor(Math.random() * 7), completed: false },
            food: { index: Math.floor(Math.random() * 7), completed: false },
            light: { index: Math.floor(Math.random() * 7), completed: false },
            love: { index: Math.floor(Math.random() * 7), completed: false },
          }
        };
        await StorageService.saveDailyMessagesState(state);
      }
      
      if (isMounted) {
        setDailyMessages(state);
      }
    };
    
    initDailyMessages();
    
    // Check every minute if midnight has passed
    intervalId = setInterval(() => {
      const today = new Date().toDateString();
      setDailyMessages(prevState => {
        if (prevState && prevState.date !== today) {
          initDailyMessages();
        }
        return prevState;
      });
    }, 60000);
    
    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  const isReplyVisibleRef = useRef(false);

  const checkPendingRequests = useCallback(() => {
    if (!dailyMessages || isReplyVisibleRef.current) return;
    
    const uncompletedCategories = Object.keys(dailyMessages.selections).filter(
      (cat) => !dailyMessages.selections[cat].completed
    );
    
    if (uncompletedCategories.length === 0) {
      setIsSpeechVisible(false);
      return;
    }
    
    // Pick the first uncompleted category so it remains consistent
    const currentCategory = uncompletedCategories[0];
    const msgIndex = dailyMessages.selections[currentCategory].index;
    const MESSAGE_LIBRARY = require('../data/messages.json');
    const requestText = MESSAGE_LIBRARY[currentCategory].requests[msgIndex];
    
    setCloverSpeech(requestText);
    setIsSpeechVisible(true);
  }, [dailyMessages]);

  // Listen for AppState changes (background to active)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState) => {
      if (nextAppState === 'active') {
        // App has returned to the foreground
        isReplyVisibleRef.current = false;
        
        // Slight delay on returning from background
        setTimeout(checkPendingRequests, 500);
      }
    });

    // Also run immediately on initial mount or when dailyMessages loads
    checkPendingRequests();

    return () => {
      subscription.remove();
    };
  }, [checkPendingRequests]);

  const markActionCompleted = async (category) => {
    if (!dailyMessages || dailyMessages.selections[category].completed) return;
    
    const newState = {
      ...dailyMessages,
      selections: {
        ...dailyMessages.selections,
        [category]: {
          ...dailyMessages.selections[category],
          completed: true
        }
      }
    };
    setDailyMessages(newState);
    await StorageService.saveDailyMessagesState(newState);
    
    // Show reply
    const msgIndex = dailyMessages.selections[category].index;
    const MESSAGE_LIBRARY = require('../data/messages.json');
    const replyText = MESSAGE_LIBRARY[category].replies[msgIndex];
    
    isReplyVisibleRef.current = true;
    clearTimeout(speechTimeoutRef.current);
    setCloverSpeech(replyText);
    setIsSpeechVisible(true);
  };

  const handleIconPress = (iconName) => {
    setActiveIcon(iconName);
    
    let category = null;
    
    // Play corresponding Lottie animation
    if (iconName === 'heart') {
      heartLottieRef.current?.reset();
      heartLottieRef.current?.play();
      category = 'love';
    } else if (iconName === 'drop') {
      waterLottieRef.current?.reset();
      waterLottieRef.current?.play();
      category = 'water';
    } else if (iconName === 'sun') {
      sunshineLottieRef.current?.reset();
      sunshineLottieRef.current?.play();
      category = 'light';
    } else if (iconName === 'sparkles') {
      nourishLottieRef.current?.reset();
      nourishLottieRef.current?.play();
      category = 'food';
    }

    if (category) {
      markActionCompleted(category);
    }

    // Every completed care action counts as exactly 1 care action (+1)
    setCareCount((prev) => {
      const nextCount = prev + 1;
      StorageService.saveCloverState(nextCount, { pendingFlower });
      return nextCount;
    });
    
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    
    timeoutRef.current = setTimeout(() => {
      setActiveIcon(null);
    }, 1000); // Stays active for 1 second
  };

  // Collect flower interaction: adds to garden and resets Clover to Stage 1 Sprout
  const handleCollectFlower = async () => {
    if (!pendingFlower) return;
    await StorageService.collectFlowerAndResetClover({
      flowerType: pendingFlower.flowerType,
      cycle: pendingFlower.cycle,
      cyclePosition: pendingFlower.cyclePosition,
    });
    setShowBlossomModal(false);
    setPendingFlower(null);
    setCareCount(0); // Clover resets to Stage 1!
  };

  const currentStage = getGrowthStage(careCount);
  const blossoming = isBlossomReady(careCount) && pendingFlower;
  const flowerMeta = blossoming ? (FLOWER_METADATA[pendingFlower.flowerType] || FLOWER_METADATA.rose) : null;

  return (
    <SafeAreaView style={styles.container}>
      
      {/* Top Navigation Row */}
      <View style={styles.navRow}>
        <TouchableOpacity 
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => setShowMenuModal(true)}
          accessibilityLabel="Open Menu"
        >
          <Feather name="menu" size={24} color={theme.text} />
        </TouchableOpacity>
        
        {/* Audio Controls */}
        <View style={{ flexDirection: 'row', alignItems: 'center', minWidth: 60, justifyContent: 'center' }}>
          {!showAudioControls ? (
            <TouchableOpacity 
              onPress={() => setShowAudioControls(true)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="musical-note" size={24} color={theme.text} />
            </TouchableOpacity>
          ) : (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: theme.card, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 }}>
              <TouchableOpacity onPress={playPreviousTrack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="play-skip-back" size={18} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={togglePlayPause} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name={isPlaying ? "pause" : "play"} size={22} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={playNextTrack} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="play-skip-forward" size={18} color={theme.text} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAudioControls(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} style={{ marginLeft: 4 }}>
                <Ionicons name="close" size={20} color={theme.subtext} />
              </TouchableOpacity>
            </View>
          )}
        </View>
        
        <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} onPress={() => router.push('/settings')}>
          <Ionicons name="settings-outline" size={24} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Greeting Text */}
      <View style={styles.greetingContainer}>
        <Text style={styles.greetingText}>
          {blossoming 
            ? '“Look what we grew together... 🌸”' 
            : (isSpeechVisible && cloverSpeech 
                ? `“${cloverSpeech.replace('{name}', userName || 'friend')}”` 
                : (userName ? `“Oh! Hi ${userName} 🫶🏻🌱”` : '“Hello, friend 🫶🏻🌱”'))}
        </Text>
      </View>

      {/* Main Clover & Blossom Container */}
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

        {/* Plant Display Container */}
        <View style={styles.plantsRow}>
          {/* Clover Plant in Foreground */}
          <Image 
            source={CLOVER_STAGE_IMAGES[currentStage]} 
            style={[styles.cloverImage, blossoming && styles.cloverImageBlossom]}
            resizeMode="contain"
          />

          {/* Blossomed Collectible Flower */}
          {blossoming && flowerMeta && (
            <Animated.View style={styles.blossomFlowerWrapper}>
              <Image
                source={flowerMeta.asset}
                style={styles.blossomFlowerImage}
                resizeMode="contain"
              />
            </Animated.View>
          )}
        </View>

        {/* Blossom Note Card (gentle discoverable note beside the bloom) */}
        {blossoming && (
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={() => setShowBlossomModal(true)}
            style={styles.noteTouchArea}
          >
            <Animated.View
              style={[
                styles.noteCardContainer,
                { transform: [{ translateY: noteFloatAnim }] },
              ]}
            >
              <Image
                source={require('../assets/images/blossom_note.png')}
                style={styles.blossomNoteImage}
                resizeMode="contain"
              />
              <View style={styles.noteCalloutPill}>
                <Text style={styles.noteCalloutText}>a note for you ✉️</Text>
              </View>
            </Animated.View>
          </TouchableOpacity>
        )}
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
        <Text style={styles.whisperSubtitle}>
          {blossoming ? 'something special has grown ✨' : 'a little whisper ✨'}
        </Text>
        <Text style={styles.whisperText}>
          {blossoming 
            ? 'Tap the little note\nto receive your bloom 🫶🏻' 
            : (typeof currentWhisper === 'string' ? currentWhisper.replace('{name}', userName || 'friend') : currentWhisper)}
        </Text>
      </View>

      {/* Blossom Discovery / Achievement Modal */}
      <Modal
        visible={showBlossomModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowBlossomModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {flowerMeta && (
              <>
                <Text style={styles.modalSubHeader}>A tender bloom has opened</Text>
                
                <View
                  style={[
                    styles.modalImageContainer,
                    { backgroundColor: flowerMeta.accentColor || theme.card },
                  ]}
                >
                  <Image
                    source={flowerMeta.asset}
                    style={styles.modalFlowerImage}
                    resizeMode="contain"
                  />
                </View>

                <Text style={styles.modalFlowerName}>{flowerMeta.name}</Text>
                <Text style={styles.modalBotanicalName}>{flowerMeta.botanicalName}</Text>
                <Text style={styles.modalMeaning}>{flowerMeta.meaning}</Text>

                <View style={styles.messageBox}>
                  <Text style={styles.modalMessageText}>“{flowerMeta.message}”</Text>
                </View>

                <TouchableOpacity
                  style={styles.modalCollectButton}
                  activeOpacity={0.85}
                  onPress={handleCollectFlower}
                >
                  <Text style={styles.modalCollectButtonText}>Place in Garden & Begin Anew 🌱</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
      
      {/* Hamburger Menu Modal */}
      <Modal
        visible={showMenuModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMenuModal(false)}
      >
        <View style={styles.menuModalOverlay}>
          <View style={styles.menuModalContent}>
            
            <View style={styles.menuHeader}>
              <Text style={styles.menuTitle}>Menu</Text>
              <TouchableOpacity onPress={() => setShowMenuModal(false)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Ionicons name="close" size={24} color={theme.text} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={styles.menuOption}
              onPress={() => {
                setShowMenuModal(false);
                router.push('/garden');
              }}
            >
              <Feather name="book-open" size={20} color={theme.text} style={styles.menuOptionIcon} />
              <Text style={styles.menuOptionText}>My Garden</Text>
            </TouchableOpacity>
            
            <View style={styles.menuDivider} />
            <Text style={styles.menuSubtitle}>Themes</Text>
            
            {['garden', 'midnight', 'lavenderDusk', 'mistyMorning'].map((t) => {
              const themeNames = {
                garden: 'Garden',
                midnight: 'Midnight',
                lavenderDusk: 'Lavender Dusk',
                mistyMorning: 'Misty Morning'
              };
              const isSelected = currentThemeId === t;
              return (
                <TouchableOpacity 
                  key={t}
                  style={styles.menuOption}
                  onPress={() => changeTheme(t)}
                >
                  <View style={[styles.themeDot, { backgroundColor: isSelected ? theme.accent : 'transparent', borderColor: theme.border }]} />
                  <Text style={[styles.menuOptionText, isSelected && { color: theme.accent, fontWeight: '600' }]}>
                    {themeNames[t]}
                  </Text>
                </TouchableOpacity>
              );
            })}
            
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const getStyles = (theme) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
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
    marginTop: 24,
    paddingHorizontal: 20,
  },
  greetingText: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: theme.text,
    textAlign: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
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
  plantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  cloverImage: {
    width: 250,
    height: 250,
    zIndex: 2,
  },
  cloverImageBlossom: {
    width: 210,
    height: 210,
    marginRight: -20,
  },
  blossomFlowerWrapper: {
    zIndex: 3,
    marginLeft: -10,
  },
  blossomFlowerImage: {
    width: 140,
    height: 180,
  },
  noteTouchArea: {
    position: 'absolute',
    bottom: -10,
    right: 36,
    zIndex: 10,
    alignItems: 'center',
  },
  noteCardContainer: {
    alignItems: 'center',
  },
  blossomNoteImage: {
    width: 72,
    height: 72,
  },
  noteCalloutPill: {
    backgroundColor: theme.card,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
    marginTop: -4,
    borderWidth: 1,
    borderColor: theme.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  noteCalloutText: {
    fontFamily: 'Amarna',
    fontSize: 12,
    color: theme.subtext,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
    marginBottom: 50,
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
    color: theme.subtext,
    marginBottom: 8,
  },
  whisperText: {
    fontFamily: 'Amarna',
    fontSize: 22,
    color: theme.text,
    textAlign: 'center',
    lineHeight: 32,
  },
  // Blossom Achievement Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: theme.card,
    borderRadius: 28,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 8,
    borderWidth: 1,
    borderColor: theme.border,
  },
  modalSubHeader: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  modalImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalFlowerImage: {
    width: 110,
    height: 110,
  },
  modalFlowerName: {
    fontFamily: 'Amarna',
    fontSize: 24,
    color: theme.text,
    marginBottom: 2,
  },
  modalBotanicalName: {
    fontFamily: 'Amarna',
    fontSize: 13,
    color: theme.subtext,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  modalMeaning: {
    fontFamily: 'Amarna',
    fontSize: 13,
    color: theme.subtext,
    backgroundColor: theme.background,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
    marginBottom: 16,
  },
  messageBox: {
    backgroundColor: theme.background,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 3,
    borderLeftColor: theme.border,
    width: '100%',
  },
  modalMessageText: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.text,
    lineHeight: 22,
    textAlign: 'center',
  },
  modalCollectButton: {
    backgroundColor: theme.accent,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalCollectButtonText: {
    fontFamily: 'Amarna',
    fontSize: 15,
    color: theme.background,
  },
  menuModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuModalContent: {
    width: '80%',
    backgroundColor: theme.background,
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  menuTitle: {
    fontFamily: 'Amarna',
    fontSize: 24,
    color: theme.text,
  },
  menuSubtitle: {
    fontFamily: 'Amarna',
    fontSize: 14,
    color: theme.subtext,
    marginBottom: 12,
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  menuDivider: {
    height: 1,
    backgroundColor: theme.border,
    marginVertical: 16,
  },
  menuOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  menuOptionIcon: {
    marginRight: 12,
  },
  menuOptionText: {
    fontFamily: 'Amarna',
    fontSize: 18,
    color: theme.text,
  },
  themeDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    marginRight: 12,
  },
});
