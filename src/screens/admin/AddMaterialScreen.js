// src/screens/admin/AddMaterialScreen.js
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
  DocumentTextIcon,
  PlayIcon,
  LinkIcon
} from 'react-native-heroicons/outline';

export default function AddMaterialScreen({ navigation, route }) {
  const { course, section } = route.params;
  const [formData, setFormData] = useState({
    title: '',
    material_type: 'video',
    material_url: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { title, material_type, material_url } = formData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter material title');
      return false;
    }

    if (material_type === 'video' && !material_url.trim()) {
      Alert.alert('Error', 'Please enter video URL');
      return false;
    }

    if (material_type === 'pdf' && !material_url.trim()) {
      Alert.alert('Error', 'Please enter PDF URL');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const materialData = {
        material_name: formData.title.trim(),
        material_type: formData.material_type,
        material_url: formData.material_url.trim(),
        content: formData.content.trim() || null
      };

      // Using createMaterial endpoint from courseController
      await courseService.createMaterial(section.id, materialData);
      
      Alert.alert(
        'Success', 
        'Material created successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create material';
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
            <Text className="text-2xl font-bold text-gray-800">Add Material</Text>
            <Text className="text-gray-500">
              {course.course_name} • {section.section_name}
            </Text>
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
            <Text className="text-lg font-bold text-gray-800 mb-4">Material Information</Text>
            
            {/* Material Title */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Material Title *</Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <DocumentTextIcon size={20} color="#6b7280" />
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-12 py-4 text-base"
                  placeholder="Enter material title"
                  value={formData.title}
                  onChangeText={(value) => handleChange('title', value)}
                />
              </View>
            </View>

            {/* Material Type */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Material Type *</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    formData.material_type === 'video' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleChange('material_type', 'video')}
                >
                  <PlayIcon 
                    size={20} 
                    color={formData.material_type === 'video' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text className={`ml-2 font-medium ${
                    formData.material_type === 'video' ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    Video
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    formData.material_type === 'pdf' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleChange('material_type', 'pdf')}
                >
                  <DocumentTextIcon 
                    size={20} 
                    color={formData.material_type === 'pdf' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text className={`ml-2 font-medium ${
                    formData.material_type === 'pdf' ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    PDF
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Material URL */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">
                {formData.material_type === 'video' ? 'Video URL *' : 'PDF URL *'}
              </Text>
              <View className="relative">
                <View className="absolute left-4 top-4 z-10">
                  <LinkIcon size={20} color="#6b7280" />
                </View>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-12 py-4 text-base"
                  placeholder={
                    formData.material_type === 'video' 
                      ? 'Enter video URL (YouTube, Vimeo, etc.)' 
                      : 'Enter PDF URL'
                  }
                  value={formData.material_url}
                  onChangeText={(value) => handleChange('material_url', value)}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {/* Content/Description */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Content Description (Optional)</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-xl p-4 text-base"
                placeholder="Enter additional content or description..."
                value={formData.content}
                onChangeText={(value) => handleChange('content', value)}
                multiline={true}
                numberOfLines={4}
                textAlignVertical="top"
              />
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
                    Create Material
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Guidelines */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
              <Text className="text-primary-700 font-semibold mb-2">Material Guidelines:</Text>
              <Text className="text-primary-600 text-sm">• Use descriptive titles for better organization</Text>
              <Text className="text-primary-600 text-sm">• Ensure URLs are accessible to students</Text>
              <Text className="text-primary-600 text-sm">• Add descriptions to provide context</Text>
              <Text className="text-primary-600 text-sm">• Organize materials in logical learning sequence</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}