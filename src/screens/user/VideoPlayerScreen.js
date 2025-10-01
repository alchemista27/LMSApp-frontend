// src/screens/user/VideoPlayerScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeftIcon } from 'react-native-heroicons/outline';

export default function VideoPlayerScreen({ route, navigation }) {
  const { videoUrl, title } = route.params;

  return (
    <View className="flex-1 bg-black">
      {/* Header */}
      <View className="absolute top-12 left-0 right-0 z-10 px-4">
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          className="bg-black bg-opacity-50 w-10 h-10 rounded-full items-center justify-center"
        >
          <ChevronLeftIcon size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Video Placeholder */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-white text-lg mb-4">Video Player</Text>
        <Text className="text-gray-400 text-center px-6">
          {title}
        </Text>
        <Text className="text-gray-500 text-sm mt-2">
          Video URL: {videoUrl}
        </Text>
      </View>

      {/* In a real app, you'd use react-native-video here */}
    </View>
  );
}