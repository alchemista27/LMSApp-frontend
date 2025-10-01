// src/screens/admin/EditCourseScreen.js
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
  BookOpenIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  StarIcon,
  ClockIcon,
  VideoCameraIcon
} from 'react-native-heroicons/outline';

export default function EditCourseScreen({ navigation, route }) {
  const { course } = route.params;
  const [formData, setFormData] = useState({
    course_name: '',
    category_id: '',
    description: '',
    learning_objectives: '',
    advantages: '',
    total_video: '',
    total_times: '',
    course_img: ''
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Load categories (mock data - same as AddCourse)
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const mockCategories = [
          { id: 1, name: 'Programming' },
          { id: 2, name: 'Design' },
          { id: 3, name: 'Business' },
          { id: 4, name: 'Marketing' },
          { id: 5, name: 'Personal Development' }
        ];
        setCategories(mockCategories);
      } catch (error) {
        Alert.alert('Error', 'Failed to load categories');
      }
    };

    loadCategories();
  }, []);

  // Populate form with course data
  useEffect(() => {
    if (course) {
      setFormData({
        course_name: course.course_name || course.name || '',
        category_id: course.category_id?.toString() || '',
        description: course.description || '',
        learning_objectives: course.learning_objectives || '',
        advantages: course.advantages || '',
        total_video: course.total_video?.toString() || '',
        total_times: course.total_times?.toString() || '',
        course_img: course.course_img || ''
      });
      setInitialLoad(false);
    }
  }, [course]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { course_name, category_id, description } = formData;

    if (!course_name.trim()) {
      Alert.alert('Error', 'Please enter course name');
      return false;
    }

    if (!category_id) {
      Alert.alert('Error', 'Please select a category');
      return false;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter course description');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const courseData = {
        course_name: formData.course_name.trim(),
        category_id: parseInt(formData.category_id),
        description: formData.description.trim(),
        learning_objectives: formData.learning_objectives.trim() || null,
        advantages: formData.advantages.trim() || null,
        total_video: parseInt(formData.total_video) || 0,
        total_times: parseInt(formData.total_times) || 0,
        course_img: formData.course_img.trim() || null
      };

      await courseService.updateCourse(course.id, courseData);
      
      Alert.alert(
        'Success', 
        'Course updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update course';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ 
    icon: Icon, 
    label, 
    placeholder, 
    value, 
    onChange, 
    multiline = false,
    numberOfLines = 1,
    ...props 
  }) => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <View className="relative">
        <View className="absolute left-4 top-4 z-10">
          <Icon size={20} color="#6b7280" />
        </View>
        <TextInput
          className={`bg-gray-50 border border-gray-300 rounded-xl px-12 text-base ${
            multiline ? 'py-3' : 'py-4'
          }`}
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          multiline={multiline}
          numberOfLines={numberOfLines}
          textAlignVertical={multiline ? 'top' : 'center'}
          {...props}
        />
      </View>
    </View>
  );

  if (initialLoad) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading course data...</Text>
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
          <View>
            <Text className="text-2xl font-bold text-gray-800">Edit Course</Text>
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
            {/* Basic Information */}
            <Text className="text-lg font-bold text-gray-800 mb-4">Basic Information</Text>
            
            <InputField
              icon={BookOpenIcon}
              label="Course Name *"
              placeholder="Enter course name"
              value={formData.course_name}
              onChange={(value) => handleChange('course_name', value)}
            />

            {/* Category Selection */}
            <View className="mb-4">
              <Text className="text-gray-700 mb-2 font-medium">Category *</Text>
              <View className="flex-row flex-wrap -mx-1">
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    className={`m-1 px-4 py-3 rounded-xl border-2 ${
                      formData.category_id === category.id.toString()
                        ? 'border-primary-600 bg-primary-50' 
                        : 'border-gray-300 bg-white'
                    }`}
                    onPress={() => handleChange('category_id', category.id.toString())}
                  >
                    <Text className={`font-medium ${
                      formData.category_id === category.id.toString() 
                        ? 'text-primary-600' 
                        : 'text-gray-600'
                    }`}>
                      {category.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <InputField
              icon={DocumentTextIcon}
              label="Description *"
              placeholder="Enter course description"
              value={formData.description}
              onChange={(value) => handleChange('description', value)}
              multiline={true}
              numberOfLines={4}
            />

            {/* Course Details */}
            <Text className="text-lg font-bold text-gray-800 mb-4 mt-6">Course Details</Text>

            <View className="flex-row space-x-4">
              <View className="flex-1">
                <InputField
                  icon={VideoCameraIcon}
                  label="Total Videos"
                  placeholder="0"
                  value={formData.total_video}
                  onChange={(value) => handleChange('total_video', value)}
                  keyboardType="numeric"
                />
              </View>
              <View className="flex-1">
                <InputField
                  icon={ClockIcon}
                  label="Total Hours"
                  placeholder="0"
                  value={formData.total_times}
                  onChange={(value) => handleChange('total_times', value)}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <InputField
              icon={AcademicCapIcon}
              label="Learning Objectives"
              placeholder="What will students learn in this course?"
              value={formData.learning_objectives}
              onChange={(value) => handleChange('learning_objectives', value)}
              multiline={true}
              numberOfLines={3}
            />

            <InputField
              icon={StarIcon}
              label="Course Advantages"
              placeholder="What makes this course special?"
              value={formData.advantages}
              onChange={(value) => handleChange('advantages', value)}
              multiline={true}
              numberOfLines={3}
            />

            {/* Course Image URL */}
            <InputField
              icon={BookOpenIcon}
              label="Course Image URL (Optional)"
              placeholder="https://example.com/image.jpg"
              value={formData.course_img}
              onChange={(value) => handleChange('course_img', value)}
              keyboardType="url"
              autoCapitalize="none"
            />

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-6">
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
                    <BookOpenIcon size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Update Course
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Course Statistics */}
            <View className="mt-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-gray-700 font-semibold mb-2">Course Statistics:</Text>
              <Text className="text-gray-600 text-sm">Course ID: {course.id}</Text>
              <Text className="text-gray-600 text-sm">
                Total Sections: {course.sections?.length || 0}
              </Text>
              <Text className="text-gray-600 text-sm">
                Total Materials: {course.sections?.reduce((total, section) => total + (section.materials?.length || 0), 0) || 0}
              </Text>
            </View>

            {/* Quick Actions */}
            <View className="mt-4">
              <Text className="text-gray-700 font-semibold mb-2">Quick Actions:</Text>
              <TouchableOpacity 
                className="bg-primary-50 rounded-xl p-3 mb-2"
                onPress={() => navigation.navigate('CourseSections', { course })}
              >
                <Text className="text-primary-600 font-medium text-center">
                  Manage Sections & Materials
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}