// src/screens/admin/AdminDashboardScreen.js
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
import { userService, courseService } from '../../services/api';
import {
  UsersIcon,
  BookOpenIcon,
  ChartBarIcon,
  ClockIcon,
  AcademicCapIcon,
  DocumentChartBarIcon
} from 'react-native-heroicons/outline';

export default function AdminDashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalEnrollments: 0,
    activeUsers: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentCourses, setRecentCourses] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboardData = async () => {
    try {
      // Load users
      const usersResponse = await userService.getUsers();
      const users = usersResponse.data;
      
      // Load courses
      const coursesResponse = await courseService.getCourses();
      const courses = coursesResponse.data;

      // Calculate stats
      setStats({
        totalUsers: users.length,
        totalCourses: courses.length,
        totalEnrollments: 45, // Mock data - replace with actual API
        activeUsers: users.filter(u => u.last_login).length // Mock filter
      });

      // Set recent data
      setRecentUsers(users.slice(0, 5));
      setRecentCourses(courses.slice(0, 5));
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

  const StatCard = ({ icon: Icon, title, value, color, onPress }) => (
    <TouchableOpacity 
      className={`bg-${color}-50 rounded-2xl p-4 flex-1 mx-1`}
      onPress={onPress}
    >
      <View className="flex-row items-center mb-2">
        <View className={`bg-${color}-100 p-2 rounded-lg mr-2`}>
          <Icon size={20} color={getColorValue(color)} />
        </View>
        <Text className={`text-${color}-600 font-semibold text-sm`}>{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </TouchableOpacity>
  );

  const getColorValue = (color) => {
    const colors = {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    return colors[color];
  };

  const QuickAction = ({ icon: Icon, title, description, color, onPress }) => (
    <TouchableOpacity 
      className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200"
      onPress={onPress}
    >
      <View className="flex-row items-center">
        <View className={`bg-${color}-100 p-3 rounded-xl mr-4`}>
          <Icon size={24} color={getColorValue(color)} />
        </View>
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">{title}</Text>
          <Text className="text-gray-500 text-sm mt-1">{description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-6 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Admin Dashboard</Text>
            <Text className="text-gray-500">Welcome back, {user?.firstname}</Text>
          </View>
          <View className="bg-success-100 px-3 py-1 rounded-full">
            <Text className="text-success-700 font-medium text-sm">ADMIN</Text>
          </View>
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
          <View className="flex-row mb-3">
            <StatCard
              icon={UsersIcon}
              title="Total Users"
              value={stats.totalUsers}
              color="primary"
              onPress={() => navigation.navigate('UserManagement')}
            />
            <StatCard
              icon={BookOpenIcon}
              title="Total Courses"
              value={stats.totalCourses}
              color="success"
              onPress={() => navigation.navigate('CourseManagement')}
            />
          </View>
          <View className="flex-row mb-6">
            <StatCard
              icon={AcademicCapIcon}
              title="Enrollments"
              value={stats.totalEnrollments}
              color="warning"
              onPress={() => navigation.navigate('EnrollmentManagement')}
            />
            <StatCard
              icon={ChartBarIcon}
              title="Active Users"
              value={stats.activeUsers}
              color="error"
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Quick Actions</Text>
          
          <QuickAction
            icon={UsersIcon}
            title="Manage Users"
            description="View, edit, and manage system users"
            color="primary"
            onPress={() => navigation.navigate('UserManagement')}
          />
          
          <QuickAction
            icon={BookOpenIcon}
            title="Manage Courses"
            description="Create and manage courses & content"
            color="success"
            onPress={() => navigation.navigate('CourseManagement')}
          />
          
          <QuickAction
            icon={DocumentChartBarIcon}
            title="Reports & Analytics"
            description="View system reports and analytics"
            color="warning"
            onPress={() => navigation.navigate('Reports')}
          />
        </View>

        {/* Recent Users */}
        <View className="px-6 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Recent Users</Text>
            <TouchableOpacity onPress={() => navigation.navigate('UserManagement')}>
              <Text className="text-primary-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {recentUsers.map((user, index) => (
              <View 
                key={user.id}
                className={`flex-row items-center p-4 ${
                  index !== recentUsers.length - 1 ? 'border-b border-gray-200' : ''
                }`}
              >
                <View className="w-10 h-10 bg-primary-100 rounded-full items-center justify-center mr-3">
                  <UsersIcon size={20} color="#3b82f6" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800">
                    {user.firstname} {user.lastname}
                  </Text>
                  <Text className="text-gray-500 text-sm">{user.email}</Text>
                </View>
                <View className={`px-2 py-1 rounded-full ${
                  user.role === 'admin' ? 'bg-success-100' : 'bg-primary-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    user.role === 'admin' ? 'text-success-700' : 'text-primary-700'
                  }`}>
                    {user.role}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Courses */}
        <View className="px-6 mb-8">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-gray-800">Recent Courses</Text>
            <TouchableOpacity onPress={() => navigation.navigate('CourseManagement')}>
              <Text className="text-primary-600 font-semibold">View All</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl shadow-sm border border-gray-200">
            {recentCourses.map((course, index) => (
              <TouchableOpacity
                key={course.id}
                className={`flex-row items-center p-4 ${
                  index !== recentCourses.length - 1 ? 'border-b border-gray-200' : ''
                }`}
                onPress={() => navigation.navigate('CourseDetail', { courseId: course.id })}
              >
                <View className="w-10 h-10 bg-success-100 rounded-xl items-center justify-center mr-3">
                  <BookOpenIcon size={20} color="#10b981" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-gray-800" numberOfLines={1}>
                    {course.course_name || course.name}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    {course.total_video || 0} videos • {course.total_times || '0'} hours
                  </Text>
                </View>
                <ClockIcon size={16} color="#6b7280" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}