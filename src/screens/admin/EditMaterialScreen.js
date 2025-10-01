// src/screens/admin/EditMaterialScreen.js
import React, { useState, useEffect } from 'react';
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
  LinkIcon,
  TrashIcon,
  EyeIcon
} from 'react-native-heroicons/outline';

export default function EditMaterialScreen({ navigation, route }) {
  const { course, section, material } = route.params;
  const [formData, setFormData] = useState({
    title: '',
    material_type: 'video',
    material_url: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (material) {
      setFormData({
        title: material.title || material.material_name || '',
        material_type: material.material_type || 'video',
        material_url: material.material_url || '',
        content: material.content || ''
      });
      setInitialLoad(false);
    }
  }, [material]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { title, material_type, material_url } = formData;

    if (!title.trim()) {
      Alert.alert('Error', 'Please enter material title');
      return false;
    }

    if ((material_type === 'video' || material_type === 'pdf') && !material_url.trim()) {
      Alert.alert('Error', `Please enter ${material_type} URL`);
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

      await courseService.updateMaterial(section.id, material.id, materialData);
      
      Alert.alert(
        'Success', 
        'Material updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update material';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Material',
      `Are you sure you want to delete "${material.title || material.material_name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await courseService.deleteMaterial(section.id, material.id);
              Alert.alert(
                'Success', 
                'Material deleted successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('CourseSections', { course }) }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete material');
            } finally {
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  const handlePreview = () => {
    if (formData.material_type === 'video') {
      navigation.navigate('VideoPlayer', { 
        videoUrl: formData.material_url,
        title: formData.title 
      });
    } else if (formData.material_type === 'pdf') {
      navigation.navigate('PDFViewer', { 
        pdfUrl: formData.material_url,
        title: formData.title 
      });
    } else {
      Alert.alert('Info', 'Preview not available for this material type');
    }
  };

  if (initialLoad) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading material data...</Text>
      </View>
    );
  }

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
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-800">Edit Material</Text>
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
                      ? 'Enter video URL' 
                      : 'Enter PDF URL'
                  }
                  value={formData.material_url}
                  onChangeText={(value) => handleChange('material_url', value)}
                  keyboardType="url"
                  autoCapitalize="none"
                />
              </View>
              // Add this section after the Material URL input in both screens:
              <View className="flex-row space-x-2 mb-4">
                <TouchableOpacity
                  className="flex-1 bg-primary-100 rounded-xl py-3 flex-row justify-center items-center"
                  onPress={() => navigation.navigate(
                  formData.material_type === 'video' ? 'VideoUpload' : 'PDFUpload',
                  { course, section, material: route.params?.material }
                  )}
                >
                  <CloudUploadIcon size={16} color="#3b82f6" />
                  <Text className="text-primary-600 font-medium text-sm ml-2">
                    Upload {formData.material_type === 'video' ? 'Video' : 'PDF'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Preview Button */}
            {formData.material_url && (
              <TouchableOpacity
                className="bg-success-50 rounded-xl py-3 mb-4 flex-row justify-center items-center"
                onPress={handlePreview}
              >
                <EyeIcon size={20} color="#10b981" />
                <Text className="text-success-600 font-semibold text-lg ml-2">
                  Preview {formData.material_type === 'video' ? 'Video' : 'PDF'}
                </Text>
              </TouchableOpacity>
            )}

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

            {/* Material Information */}
            <View className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-gray-700 font-semibold mb-2">Material Information</Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-600 text-sm">Type</Text>
                  <Text className="text-gray-800 font-bold capitalize">
                    {material.material_type}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Created</Text>
                  <Text className="text-gray-800 text-sm">
                    {material.created_at ? new Date(material.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Last Updated</Text>
                  <Text className="text-gray-800 text-sm">
                    {material.updated_at ? new Date(material.updated_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4 flex-row justify-center items-center"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 bg-primary-600 rounded-xl py-4 flex-row justify-center items-center ${
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
                      Update Material
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Delete Material */}
            <TouchableOpacity
              className={`bg-error-50 rounded-xl py-4 mt-3 flex-row justify-center items-center ${
                deleteLoading ? 'opacity-50' : ''
              }`}
              onPress={handleDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <ActivityIndicator size="small" color="#ef4444" />
              ) : (
                <>
                  <TrashIcon size={20} color="#ef4444" />
                  <Text className="text-error-600 font-semibold text-lg ml-2">
                    Delete Material
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}