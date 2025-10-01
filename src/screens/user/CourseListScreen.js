// src/screens/user/CourseListScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  Alert
} from 'react-native';
import { courseService } from '../../services/api';
import {
  MagnifyingGlassIcon,
  FunnelIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon
} from 'react-native-heroicons/outline';

export default function CourseListScreen({ navigation }) {
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
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
      onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
    >
      <View className="flex-row">
        {/* Course Image/Icon */}
        <View className="w-16 h-16 bg-primary-100 rounded-xl items-center justify-center mr-4">
          {course.course_img ? (
            <Text>🖼️</Text> // Replace with actual image component
          ) : (
            <BookOpenIcon size={28} color="#3b82f6" />
          )}
        </View>

        {/* Course Info */}
        <View className="flex-1">
          <Text className="font-bold text-lg text-gray-800 mb-1" numberOfLines={2}>
            {course.course_name || course.name}
          </Text>
          <Text className="text-gray-500 text-sm mb-2" numberOfLines={2}>
            {course.description || 'No description available'}
          </Text>

          {/* Course Stats */}
          <View className="flex-row items-center">
            <View className="flex-row items-center mr-4">
              <ClockIcon size={14} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {course.total_times || '0'}h
              </Text>
            </View>
            <View className="flex-row items-center">
              <UserIcon size={14} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {course.total_video || 0} videos
              </Text>
            </View>
          </View>

          {/* Learning Objectives */}
          {course.learning_objectives && (
            <View className="mt-2">
              <Text className="text-gray-700 text-sm font-medium">You'll learn:</Text>
              <Text className="text-gray-500 text-xs" numberOfLines={2}>
                {course.learning_objectives}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Action Button */}
      <TouchableOpacity 
        className="bg-primary-600 rounded-xl py-3 mt-4"
        onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
      >
        <Text className="text-white text-center font-semibold">
          View Course
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
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
        <Text className="text-2xl font-bold text-gray-800 mb-2">All Courses</Text>
        <Text className="text-gray-500">
          {filteredCourses.length} courses available
        </Text>
      </View>

      {/* Search Bar */}
      <View className="px-6 py-4 bg-white shadow-sm">
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <MagnifyingGlassIcon size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search courses..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text className="text-primary-600 font-medium">Clear</Text>
            </TouchableOpacity>
          ) : (
            <FunnelIcon size={20} color="#9ca3af" />
          )}
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
                : 'No courses available at the moment'
              }
            </Text>
            {searchQuery && (
              <TouchableOpacity 
                className="bg-primary-600 rounded-xl px-6 py-3 mt-4"
                onPress={() => setSearchQuery('')}
              >
                <Text className="text-white font-semibold">Clear Search</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}