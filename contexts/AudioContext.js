import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';

const AudioContext = createContext();

export const useAudio = () => useContext(AudioContext);

const TRACKS = [
  require('../assets/audio/leberch-ambient-ambient-music-595680.mp3'),
  require('../assets/audio/leberch-ambient-ambient-music-604092.mp3'),
  require('../assets/audio/marlowemusic-dreamy-ambient-587567.mp3'),
  require('../assets/audio/morgan-ambient-calm-ambient-dreamscape-529861.mp3'),
  require('../assets/audio/velariomusic-calm-ambient-603158.mp3'),
];

export const AudioProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);
  const soundRef = useRef(null);

  useEffect(() => {
    // Configure audio mode for background play
    const initAudio = async () => {
      try {
        await Audio.setAudioModeAsync({
          staysActiveInBackground: true,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          playThroughEarpieceAndroid: false,
        });
        setIsReady(true);
      } catch (e) {
        console.warn('Failed to set audio mode:', e);
      }
    };
    initAudio();
  }, []);

  const loadAndPlayTrack = async (index, shouldPlay = true) => {
    try {
      if (soundRef.current) {
        await soundRef.current.unloadAsync();
        soundRef.current = null;
      }
      const { sound } = await Audio.Sound.createAsync(TRACKS[index]);
      soundRef.current = sound;
      
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.didJustFinish) {
          playNextTrack();
        }
      });

      if (shouldPlay) {
        await sound.playAsync();
        setIsPlaying(true);
      }
    } catch (e) {
      console.warn('Failed to load track', e);
    }
  };

  useEffect(() => {
    if (isReady) {
      loadAndPlayTrack(currentTrackIndex, isPlaying);
    }
  }, [currentTrackIndex, isReady]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  }, []);

  const togglePlayPause = async () => {
    if (!soundRef.current) {
      await loadAndPlayTrack(currentTrackIndex, true);
      return;
    }

    if (isPlaying) {
      await soundRef.current.pauseAsync();
      setIsPlaying(false);
    } else {
      await soundRef.current.playAsync();
      setIsPlaying(true);
    }
  };

  const playNextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    // Note: loadAndPlayTrack will be called automatically by the useEffect
  };

  const playPreviousTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    // Note: loadAndPlayTrack will be called automatically by the useEffect
  };

  return (
    <AudioContext.Provider value={{ isPlaying, togglePlayPause, playNextTrack, playPreviousTrack }}>
      {children}
    </AudioContext.Provider>
  );
};
