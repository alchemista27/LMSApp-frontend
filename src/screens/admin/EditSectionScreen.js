// src/screens/admin/EditSectionScreen.js
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
  TrashIcon
} from 'react-native-heroicons/outline';

export default function EditSectionScreen({ navigation, route }) {
  const { course, section } = route.params;
  const [formData, setFormData] = useState({
    section_name: ''
  });
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (section) {
      setFormData({
        section_name: section.section_name || ''
      });
      setInitialLoad(false);
    }
  }, [section]);

  const handleSubmit = async () => {
    if (!formData.section_name.trim()) {
      Alert.alert('Error', 'Please enter section name');
      return;
    }

    setLoading(true);
    try {
      await courseService.updateSection(course.id, section.id, {
        section_name: formData.section_name.trim()
      });
      
      Alert.alert(
        'Success', 
        'Section updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update section';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete Section',
      `Are you sure you want to delete "${section.section_name}"? This will also delete all ${section.materials?.length || 0} materials in this section.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            setDeleteLoading(true);
            try {
              await courseService.deleteSection(course.id, section.id);
              Alert.alert(
                'Success', 
                'Section deleted successfully!',
                [{ text: 'OK', onPress: () => navigation.navigate('CourseSections', { course }) }]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to delete section');
            } finally {
              setDeleteLoading(false);
            }
          }
        }
      ]
    );
  };

  if (initialLoad) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading section data...</Text>
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
            <Text className="text-2xl font-bold text-gray-800">Edit Section</Text>
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
                  placeholder="Enter section name"
                  value={formData.section_name}
                  onChangeText={(value) => setFormData({ section_name: value })}
                />
              </View>
            </View>

            {/* Section Statistics */}
            <View className="mb-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-gray-700 font-semibold mb-2">Section Statistics</Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-gray-600 text-sm">Total Materials</Text>
                  <Text className="text-gray-800 font-bold text-lg">
                    {section.materials?.length || 0}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Created</Text>
                  <Text className="text-gray-800 text-sm">
                    {section.created_at ? new Date(section.created_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
                <View>
                  <Text className="text-gray-600 text-sm">Last Updated</Text>
                  <Text className="text-gray-800 text-sm">
                    {section.updated_at ? new Date(section.updated_at).toLocaleDateString() : 'N/A'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Materials Preview */}
            {section.materials && section.materials.length > 0 && (
              <View className="mb-6">
                <Text className="text-gray-700 font-semibold mb-2">Materials in this Section</Text>
                <View className="border border-gray-200 rounded-xl">
                  {section.materials.map((material, index) => (
                    <View 
                      key={material.id}
                      className={`flex-row items-center p-3 ${
                        index !== section.materials.length - 1 ? 'border-b border-gray-200' : ''
                      }`}
                    >
                      <View className="w-8 h-8 rounded-lg bg-primary-50 items-center justify-center mr-3">
                        {material.material_type === 'video' ? (
                          <Text className="text-primary-600 text-xs">🎥</Text>
                        ) : (
                          <Text className="text-primary-600 text-xs">📄</Text>
                        )}
                      </View>
                      <View className="flex-1">
                        <Text className="font-medium text-gray-800 text-sm">
                          {material.title || material.material_name}
                        </Text>
                        <Text className="text-gray-500 text-xs capitalize">
                          {material.material_type}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}

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
                      Update Section
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Delete Section */}
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
                    Delete Section
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