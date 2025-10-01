// src/screens/admin/SectionManagementScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { courseService } from '../../services/api';
import {
  ChevronLeftIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  DocumentTextIcon,
  PlayIcon,
  ArrowUpIcon,
  ArrowDownIcon
} from 'react-native-heroicons/outline';

export default function SectionManagementScreen({ navigation, route }) {
  const { course } = route.params;
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadSections = async () => {
    try {
      const response = await courseService.getCourse(course.id);
      setSections(response.data.sections || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load sections');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadSections();
    setRefreshing(false);
  };

  const handleDeleteSection = (section) => {
    Alert.alert(
      'Delete Section',
      `Are you sure you want to delete "${section.section_name}"? This will also delete all materials in this section.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await courseService.deleteSection(course.id, section.id);
              Alert.alert('Success', 'Section deleted successfully');
              loadSections();
            } catch (error) {
              Alert.alert('Error', 'Failed to delete section');
            }
          }
        }
      ]
    );
  };

  const handleReorder = async (sectionId, direction) => {
    // In a real app, you'd have an API for reordering
    Alert.alert('Info', 'Reordering functionality would be implemented here');
  };

  useEffect(() => {
    loadSections();
  }, [course.id]);

  const SectionCard = ({ section, index }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row items-center justify-between">
        <View className="flex-1">
          <View className="flex-row items-center mb-2">
            <Text className="text-gray-400 text-sm mr-3">#{index + 1}</Text>
            <Text className="font-bold text-gray-800 text-lg flex-1">
              {section.section_name}
            </Text>
          </View>
          
          <Text className="text-gray-500 text-sm">
            {section.materials?.length || 0} materials
          </Text>
        </View>

        {/* Reorder Buttons */}
        <View className="flex-row space-x-1 mr-3">
          <TouchableOpacity 
            className="bg-gray-100 p-2 rounded-lg"
            onPress={() => handleReorder(section.id, 'up')}
            disabled={index === 0}
          >
            <ArrowUpIcon size={16} color={index === 0 ? '#d1d5db' : '#374151'} />
          </TouchableOpacity>
          <TouchableOpacity 
            className="bg-gray-100 p-2 rounded-lg"
            onPress={() => handleReorder(section.id, 'down')}
            disabled={index === sections.length - 1}
          >
            <ArrowDownIcon size={16} color={index === sections.length - 1 ? '#d1d5db' : '#374151'} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Materials List */}
      {section.materials && section.materials.length > 0 && (
        <View className="mt-3 border-t border-gray-200 pt-3">
          <Text className="text-gray-600 font-medium mb-2">Materials:</Text>
          {section.materials.map((material, matIndex) => (
            <View key={material.id} className="flex-row items-center bg-gray-50 rounded-lg p-2 mb-2">
              <View className="w-8 h-8 rounded-lg bg-primary-50 items-center justify-center mr-3">
                {material.material_type === 'video' ? (
                  <PlayIcon size={16} color="#3b82f6" />
                ) : (
                  <DocumentTextIcon size={16} color="#3b82f6" />
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
              // And in the material list, update the edit button:
              <TouchableOpacity 
                className="bg-warning-50 p-1 rounded"
                onPress={() => navigation.navigate('EditMaterial', { 
                  course, 
                  section, 
                  material 
                })}
              >
                <PencilIcon size={14} color="#f59e0b" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* Action Buttons */}
      <View className="flex-row justify-between mt-4 pt-3 border-t border-gray-200">
        <TouchableOpacity 
          className="flex-1 bg-primary-50 px-3 py-2 rounded-lg flex-row items-center justify-center mr-2"
          onPress={() => navigation.navigate('AddMaterial', { course, section })}
        >
          <PlusIcon size={16} color="#3b82f6" />
          <Text className="text-primary-600 font-medium text-sm ml-2">Add Material</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-warning-50 px-3 py-2 rounded-lg flex-row items-center mr-2"
          onPress={() => navigation.navigate('EditSection', { course, section })}
        >
          <PencilIcon size={16} color="#f59e0b" />
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-error-50 px-3 py-2 rounded-lg flex-row items-center"
          onPress={() => handleDeleteSection(section)}
        >
          <TrashIcon size={16} color="#ef4444" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading sections...</Text>
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
            <Text className="text-2xl font-bold text-gray-800" numberOfLines={1}>
              {course.course_name || course.name}
            </Text>
            <Text className="text-gray-500">Section Management</Text>
          </View>
          <TouchableOpacity 
            className="bg-primary-600 px-4 py-2 rounded-xl flex-row items-center"
            onPress={() => navigation.navigate('AddSection', { course })}
          >
            <PlusIcon size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Section</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-4"
      >
        <Text className="text-gray-500 mb-4">
          {sections.length} sections • {sections.reduce((total, section) => total + (section.materials?.length || 0), 0)} total materials
        </Text>

        {sections.length > 0 ? (
          sections.map((section, index) => (
            <SectionCard key={section.id} section={section} index={index} />
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center mt-8">
            <DocumentTextIcon size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-xl font-medium mt-4">
              No Sections Yet
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Start by creating your first section for this course
            </Text>
            <TouchableOpacity 
              className="bg-primary-600 rounded-xl px-6 py-3 mt-4"
              onPress={() => navigation.navigate('AddSection', { course })}
            >
              <Text className="text-white font-semibold">Create First Section</Text>
            </TouchableOpacity>
            // In the SectionCard component, update the Edit button:
            <TouchableOpacity 
              className="bg-warning-50 px-3 py-2 rounded-lg flex-row items-center mr-2"
              onPress={() => navigation.navigate('EditSection', { course, section })}
            >
              <PencilIcon size={16} color="#f59e0b" />
            </TouchableOpacity>
          </View>
        )}

        <View className="h-20" />
      </ScrollView>
    </View>
  );
}