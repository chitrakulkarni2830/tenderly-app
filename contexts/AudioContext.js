import { createContext, useContext, useEffect } from 'react';
import { useAudioPlaylist, useAudioPlaylistStatus, setAudioModeAsync } from 'expo-audio';

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
  const playlist = useAudioPlaylist({
    sources: TRACKS,
    loop: 'all',
  });
  
  const status = useAudioPlaylistStatus(playlist);

  useEffect(() => {
    // Configure audio mode for background play
    setAudioModeAsync({
      shouldPlayInBackground: true,
      playsInSilentMode: true,
    }).catch((e) => console.warn('Failed to set audio mode:', e));
  }, []);

  const togglePlayPause = () => {
    if (status.playing) {
      playlist.pause();
    } else {
      playlist.play();
    }
  };

  return (
    <AudioContext.Provider value={{ 
      isPlaying: status.playing, 
      togglePlayPause, 
      playNextTrack: () => playlist.next(), 
      playPreviousTrack: () => playlist.previous() 
    }}>
      {children}
    </AudioContext.Provider>
  );
};
