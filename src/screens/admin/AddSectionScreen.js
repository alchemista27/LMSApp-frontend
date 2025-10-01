// src/screens/admin/AddSectionScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { courseService } from '../../services/api';
import {
  ChevronLeftIcon,
  DocumentTextIcon
} from 'react-native-heroicons/outline';

export default function AddSectionScreen({ navigation, route }) {
  const { course } = route.params;
  const [formData, setFormData] = useState({
    section_name: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!formData.section_name.trim()) {
      Alert.alert('Error', 'Please enter section name');
      return;
    }

    setLoading(true);
    try {
      await courseService.createSection(course.id, {
        section_name: formData.section_name.trim()
      });
      
      Alert.alert(
        'Success', 
        'Section created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create section';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-800">Add New Section</Text>
            <Text className="text-gray-500">{course.course_name || course.name}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pt-6">
          {/* Form Container */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <Text className="text-lg font-bold text-gray-800 mb-4">Section Information</Text>
            
            {/* Section Name */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Section Name *</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <DocumentTextIcon size={20} color="#6b7280" />
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-12 py-4 text-base"
                  placeholder="Enter section name (e.g., 'Introduction', 'Advanced Topics')"
                  value={formData.section_name}
                  onChangeText={(value) => setFormData({ section_name: value })}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-primary-600 rounded-xl py-4 flex-row justify-center items-center ${
                loading ? 'opacity-50' : ''
              }`}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color="white" />
              ) : (
                <>
                  <DocumentTextIcon size={20} color="white" />
                  <Text className="text-white font-semibold text-lg ml-2">
                    Create Section
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Guidelines */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
              <Text className="text-primary-700 font-semibold mb-2">Section Tips:</Text>
              <Text className="text-primary-600 text-sm">• Use clear and descriptive section names</Text>
              <Text className="text-primary-600 text-sm">• Organize sections in logical learning order</Text>
              <Text className="text-primary-600 text-sm">• Keep sections focused on specific topics</Text>
              <Text className="text-primary-600 text-sm">• You can add materials after creating the section</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}