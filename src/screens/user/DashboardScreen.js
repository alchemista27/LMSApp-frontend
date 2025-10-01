// src/screens/user/DashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  Alert
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { courseService } from '../../services/api';
import {
  BookOpenIcon,
  AcademicCapIcon,
  ClockIcon,
  UserGroupIcon
} from 'react-native-heroicons/outline';

export default function DashboardScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completedCourses: 0,
    learningTime: 0
  });
  const [recentCourses, setRecentCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // In a real app, you'd have specific endpoints for these
      const coursesResponse = await courseService.getCourses();
      const courses = coursesResponse.data;
      
      // Mock stats - replace with actual API calls
      setStats({
        totalCourses: courses.length,
        enrolledCourses: Math.min(3, courses.length), // Mock enrolled count
        completedCourses: 1, // Mock completed count
        learningTime: 12 // Mock hours
      });

      // Set recent courses (first 3)
      setRecentCourses(courses.slice(0, 3));
    } catch (error) {
      Alert.alert('Error', 'Failed to load dashboard data');
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
    setRefreshing(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const StatCard = ({ icon: Icon, title, value, color }) => (
    <View className={`bg-${color}-50 rounded-2xl p-4 flex-1 mx-1`}>
      <View className="flex-row items-center mb-2">
        <View className={`bg-${color}-100 p-2 rounded-lg mr-2`}>
          <Icon size={20} color={color === 'primary' ? '#3b82f6' : '#10b981'} />
        </View>
        <Text className={`text-${color}-600 font-semibold text-sm`}>{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </View>
  );

  const CourseCard = ({ course }) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200"
      onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
    >
      <View className="flex-row items-center mb-2">
        <View className="w-12 h-12 bg-primary-100 rounded-lg items-center justify-center mr-3">
          <BookOpenIcon size={24} color="#3b82f6" />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg" numberOfLines={2}>
            {course.course_name || course.name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {course.total_video || 0} videos • {course.total_times || '0'} hours
          </Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-2">
        <View className="flex-row items-center">
          <ClockIcon size={16} color="#6b7280" />
          <Text className="text-gray-500 text-sm ml-1">Updated recently</Text>
        </View>
        <TouchableOpacity className="bg-primary-50 px-3 py-1 rounded-full">
          <Text className="text-primary-600 font-medium text-sm">Continue</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800">
              Welcome back,
            </Text>
            <Text className="text-2xl font-bold text-primary-600">
              {user?.firstname}!
            </Text>
          </View>
          <TouchableOpacity 
            className="bg-gray-100 w-10 h-10 rounded-full items-center justify-center"
            onPress={logout}
          >
            <UserGroupIcon size={20} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Stats Grid */}
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Overview</Text>
          <View className="flex-row mb-6">
            <StatCard
              icon={BookOpenIcon}
              title="Total Courses"
              value={stats.totalCourses}
              color="primary"
            />
            <StatCard
              icon={AcademicCapIcon}
              title="Enrolled"
              value={stats.enrolledCourses}
              color="success"
            />
          </View>
          <View className="flex-row mb-6">
            <StatCard
              icon={AcademicCapIcon}
              title="Completed"
              value={stats.completedCourses}
              color="success"
            />
            <StatCard
              icon={ClockIcon}
              title="Learning Hours"
              value={stats.learningTime}
              color="primary"
            />
          </View>
        </View>

        {/* Recent Courses */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Recent Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CourseList')}>
              <Text className="text-primary-600 font-semibold">See All</Text>
            </TouchableOpacity>
          </View>

          {recentCourses.length > 0 ? (
            recentCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              <BookOpenIcon size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No courses available
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Start your learning journey by exploring our courses
              </Text>
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          <View className="flex-row flex-wrap justify-between">
            <TouchableOpacity 
              className="bg-white w-48 rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
              onPress={() => navigation.navigate('CourseList')}
            >
              <View className="flex-row items-center">
                <View className="bg-primary-100 p-2 rounded-lg mr-3">
                  <BookOpenIcon size={20} color="#3b82f6" />
                </View>
                <Text className="font-semibold text-gray-800">Browse Courses</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              className="bg-white w-48 rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
              onPress={() => navigation.navigate('Profile')}
            >
              <View className="flex-row items-center">
                <View className="bg-success-100 p-2 rounded-lg mr-3">
                  <AcademicCapIcon size={20} color="#10b981" />
                </View>
                <Text className="font-semibold text-gray-800">My Profile</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}