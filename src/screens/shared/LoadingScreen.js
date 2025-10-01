// src/screens/shared/LoadingScreen.js
import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function LoadingScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text className="text-gray-600 mt-4 text-lg">Loading...</Text>
    </View>
  );
}