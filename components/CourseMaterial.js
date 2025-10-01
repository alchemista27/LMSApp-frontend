// components/CourseMaterial.js
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { WebView } from "react-native-webview";
import { Video } from "expo-av";

export default function CourseMaterial({ material }) {
  return (
    <View className="mb-4">
      <Text className="text-white font-semibold mb-2">{material.title}</Text>
      {material.type === "pdf" ? (
        <View className="h-64 border border-graycustom rounded overflow-hidden">
          <WebView source={{ uri: material.url }} />
        </View>
      ) : (
        <View className="h-64 rounded overflow-hidden">
          <Video
            source={{ uri: material.url }}
            useNativeControls
            resizeMode="contain"
            style={{ flex: 1 }}
          />
        </View>
      )}
    </View>
  );
}
