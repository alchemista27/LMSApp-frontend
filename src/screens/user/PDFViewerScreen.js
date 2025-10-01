// src/screens/user/PDFViewerScreen.js
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ChevronLeftIcon, DocumentTextIcon } from 'react-native-heroicons/outline';

export default function PDFViewerScreen({ route, navigation }) {
  const { pdfUrl, title } = route.params;

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 shadow-sm">
        <View className="px-6 flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={1}>
            {title}
          </Text>
        </View>
      </View>

      {/* PDF Placeholder */}
      <View className="flex-1 justify-center items-center bg-gray-100">
        <DocumentTextIcon size={64} color="#d1d5db" />
        <Text className="text-gray-500 text-lg mt-4">PDF Viewer</Text>
        <Text className="text-gray-400 text-center px-6 mt-2">
          {title}
        </Text>
        <Text className="text-gray-400 text-sm mt-4">
          PDF URL: {pdfUrl}
        </Text>
        
        <TouchableOpacity className="bg-primary-600 rounded-xl px-6 py-3 mt-6">
          <Text className="text-white font-semibold">Download PDF</Text>
        </TouchableOpacity>
      </View>

      {/* In a real app, you'd use react-native-pdf here */}
    </View>
  );
}