// src/screens/admin/CourseManagementScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { courseService } from '../../services/api';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  BookOpenIcon,
  ClockIcon
} from 'react-native-heroicons/outline';

export default function CourseManagementScreen({ navigation }) {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data);
      setFilteredCourses(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadCourses();
    setRefreshing(false);
  };

  const handleDeleteCourse = (course) => {
    Alert.alert(
      'Delete Course',
      `Are you sure you want to delete "${course.course_name || course.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await courseService.deleteCourse(course.id);
              Alert.alert('Success', 'Course deleted successfully');
              loadCourses(); // Reload the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete course');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadCourses();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = courses.filter(course =>
        course.course_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    } else {
      setFilteredCourses(courses);
    }
  }, [searchQuery, courses]);

  const CourseCard = ({ course }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row">
        <View className="w-16 h-16 bg-primary-100 rounded-xl items-center justify-center mr-4">
          <BookOpenIcon size={28} color="#3b82f6" />
        </View>
        
        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-lg" numberOfLines={2}>
            {course.course_name || course.name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1" numberOfLines={2}>
            {course.description || 'No description available'}
          </Text>
          
          <View className="flex-row items-center mt-2">
            <View className="flex-row items-center mr-4">
              <ClockIcon size={14} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {course.total_times || '0'}h
              </Text>
            </View>
            <Text className="text-gray-500 text-xs">
              {course.total_video || 0} videos
            </Text>
          </View>

          {course.learning_objectives && (
            <Text className="text-gray-600 text-xs mt-2" numberOfLines={2}>
              {course.learning_objectives}
            </Text>
          )}
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-3 mt-4">
        <TouchableOpacity 
          className="bg-primary-50 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => navigation.navigate('CourseSections', { course })}
        >
          <BookOpenIcon size={16} color="#3b82f6" />
          <Text className="text-primary-600 font-medium ml-2">Sections</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-warning-50 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => navigation.navigate('EditCourse', { course })}
        >
          <PencilIcon size={16} color="#f59e0b" />
          <Text className="text-warning-600 font-medium ml-2">Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-error-50 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => handleDeleteCourse(course)}
        >
          <TrashIcon size={16} color="#ef4444" />
          <Text className="text-error-600 font-medium ml-2">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600">Loading courses...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">Course Management</Text>
          <TouchableOpacity 
            className="bg-primary-600 px-4 py-2 rounded-xl flex-row items-center"
            onPress={() => navigation.navigate('AddCourse')}
          >
            <PlusIcon size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add Course</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <MagnifyingGlassIcon size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search courses by name or description..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Course List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-4"
      >
        <Text className="text-gray-500 mb-4">
          {filteredCourses.length} courses found
        </Text>

        {filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center mt-8">
            <BookOpenIcon size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-xl font-medium mt-4">
              No courses found
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'No courses available'
              }
            </Text>
            <TouchableOpacity 
              className="bg-primary-600 rounded-xl px-6 py-3 mt-4"
              onPress={() => navigation.navigate('AddCourse')}
            >
              <Text className="text-white font-semibold">Create First Course</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}