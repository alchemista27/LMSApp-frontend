// src/screens/user/EnhancedVideoPlayerScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Alert,
  BackHandler
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import {
  ChevronLeftIcon,
  PlayIcon,
  PauseIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ForwardIcon,
  BackwardIcon
} from 'react-native-heroicons/outline';
import { useProgress } from '../../context/ProgressContext';

const { width, height } = Dimensions.get('window');

export default function EnhancedVideoPlayerScreen({ route, navigation }) {
  const { videoUrl, title, courseId, materialId } = route.params;
  const { markMaterialComplete, updateTimeSpent } = useProgress();
  const videoRef = useRef(null);
  
  const [paused, setPaused] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buffering, setBuffering] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1.0);

  useEffect(() => {
    // Lock to landscape when fullscreen
    if (fullscreen) {
      Orientation.lockToLandscape();
    } else {
      Orientation.lockToPortrait();
    }

    // Handle back button
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (fullscreen) {
        setFullscreen(false);
        return true;
      }
      return false;
    });

    // Auto-hide controls after 3 seconds
    let controlsTimeout;
    if (showControls && !paused) {
      controlsTimeout = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }

    return () => {
      backHandler.remove();
      clearTimeout(controlsTimeout);
      Orientation.lockToPortrait();
    };
  }, [fullscreen, showControls, paused]);

  // Track when video reaches 90% completion
  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
    
    // Mark as completed when user watches 90% of the video
    if (duration > 0 && data.currentTime > duration * 0.9) {
      markMaterialComplete(courseId, materialId);
    }
  };

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused && currentTime > 0) {
        // Update time spent every 30 seconds of actual watching
        updateTimeSpent(courseId, 0.5); // 0.5 minutes = 30 seconds
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [paused, currentTime, courseId]);
  
  const togglePlayPause = () => {
    setPaused(!paused);
    setShowControls(true);
  };

  const toggleFullscreen = () => {
    setFullscreen(!fullscreen);
    setShowControls(true);
  };

  const toggleMute = () => {
    setMuted(!muted);
    setShowControls(true);
  };

  const seekForward = () => {
    videoRef.current.seek(currentTime + 10);
    setShowControls(true);
  };

  const seekBackward = () => {
    videoRef.current.seek(currentTime - 10);
    setShowControls(true);
  };

  const changePlaybackRate = () => {
    const rates = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
    const currentIndex = rates.indexOf(playbackRate);
    const nextIndex = (currentIndex + 1) % rates.length;
    setPlaybackRate(rates[nextIndex]);
    setShowControls(true);
  };

  const onProgress = (data) => {
    setCurrentTime(data.currentTime);
  };

  const onLoad = (data) => {
    setDuration(data.duration);
    setLoading(false);
  };

  const onBuffer = ({ isBuffering }) => {
    setBuffering(isBuffering);
  };

  const onError = (error) => {
    Alert.alert('Playback Error', 'Failed to play video. Please check your connection.');
    console.error('Video playback error:', error);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const ProgressBar = () => {
    const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    return (
      <View className="w-full">
        <View className="flex-row justify-between mb-1">
          <Text className="text-white text-xs">{formatTime(currentTime)}</Text>
          <Text className="text-white text-xs">{formatTime(duration)}</Text>
        </View>
        <View className="w-full bg-gray-600 bg-opacity-50 rounded-full h-2">
          <View 
            className="bg-red-600 h-2 rounded-full"
            style={{ width: `${progress}%` }}
          />
        </View>
      </View>
    );
  };

  const ControlButton = ({ icon: Icon, onPress, size = 24 }) => (
    <TouchableOpacity
      className="p-3"
      onPress={onPress}
    >
      <Icon size={size} color="white" />
    </TouchableOpacity>
  );

  const VideoControls = () => (
    <View 
      className={`absolute inset-0 bg-black bg-opacity-50 justify-center items-center ${
        showControls ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transition: 'opacity 0.3s' }}
    >
      {/* Top Bar */}
      <View className="absolute top-4 left-0 right-0 px-4 flex-row justify-between items-center">
        <TouchableOpacity 
          onPress={fullscreen ? toggleFullscreen : () => navigation.goBack()}
          className="bg-black bg-opacity-50 p-2 rounded-full"
        >
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
        
        <Text className="text-white font-semibold text-lg flex-1 mx-4" numberOfLines={1}>
          {title}
        </Text>

        <TouchableOpacity 
          onPress={toggleFullscreen}
          className="bg-black bg-opacity-50 p-2 rounded-full"
        >
          {fullscreen ? (
            <ArrowsPointingInIcon size={24} color="white" />
          ) : (
            <ArrowsPointingOutIcon size={24} color="white" />
          )}
        </TouchableOpacity>
      </View>

      {/* Center Controls */}
      <View className="flex-row items-center justify-center space-x-8">
        <ControlButton icon={BackwardIcon} onPress={seekBackward} size={32} />
        
        <TouchableOpacity
          className="bg-white bg-opacity-20 p-4 rounded-full"
          onPress={togglePlayPause}
        >
          {paused ? (
            <PlayIcon size={36} color="white" />
          ) : (
            <PauseIcon size={36} color="white" />
          )}
        </TouchableOpacity>
        
        <ControlButton icon={ForwardIcon} onPress={seekForward} size={32} />
      </View>

      {/* Bottom Bar */}
      <View className="absolute bottom-4 left-0 right-0 px-4">
        <ProgressBar />
        
        <View className="flex-row justify-between items-center mt-3">
          <View className="flex-row items-center">
            <ControlButton 
              icon={muted ? SpeakerXMarkIcon : SpeakerWaveIcon} 
              onPress={toggleMute} 
            />
            <Text className="text-white text-sm ml-1">
              {playbackRate}x
            </Text>
            <TouchableOpacity 
              onPress={changePlaybackRate}
              className="ml-2 px-2 py-1 bg-white bg-opacity-20 rounded"
            >
              <Text className="text-white text-xs">Speed</Text>
            </TouchableOpacity>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-white text-sm">
              {Math.round(progress)}%
            </Text>
          </View>
        </View>
      </View>
    </View>
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <View className="flex-1 bg-black">
      {/* Video Player */}
      <TouchableOpacity 
        className="flex-1"
        activeOpacity={1}
        onPress={() => setShowControls(!showControls)}
      >
        <Video
          ref={videoRef}
          source={{ uri: videoUrl }}
          style={{
            width: fullscreen ? height : width,
            height: fullscreen ? width : width * (9/16),
            alignSelf: 'center'
          }}
          paused={paused}
          volume={volume}
          muted={muted}
          rate={playbackRate}
          onProgress={onProgress}
          onLoad={onLoad}
          onBuffer={onBuffer}
          onError={onError}
          resizeMode="contain"
          controls={false}
          ignoreSilentSwitch="obey"
        />

        {/* Loading Indicator */}
        {(loading || buffering) && (
          <View className="absolute inset-0 justify-center items-center">
            <ActivityIndicator size="large" color="white" />
            <Text className="text-white mt-2">
              {buffering ? 'Buffering...' : 'Loading...'}
            </Text>
          </View>
        )}

        {/* Video Controls */}
        <VideoControls />

        {/* Progress Overlay */}
        {!showControls && progress > 0 && (
          <View className="absolute top-12 left-4 right-4">
            <Text className="text-white font-semibold" numberOfLines={1}>
              {title}
            </Text>
            <View className="w-full bg-gray-600 bg-opacity-50 rounded-full h-1 mt-2">
              <View 
                className="bg-red-600 h-1 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </View>
          </View>
        )}
      </TouchableOpacity>

      {/* Course Info (only in portrait) */}
      {!fullscreen && (
        <View className="p-4 bg-gray-900">
          <Text className="text-white text-lg font-semibold">{title}</Text>
          <Text className="text-gray-400 text-sm mt-1">
            Progress: {Math.round(progress)}% • {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      )}
    </View>
  );
}