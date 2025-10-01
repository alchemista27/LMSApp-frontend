// src/screens/user/ProgressDashboardScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator
} from 'react-native';
import { useProgress } from '../../context/ProgressContext';
import { useEnrollment } from '../../context/EnrollmentContext';
import {
  AcademicCapIcon,
  ClockIcon,
  BookOpenIcon,
  CheckCircleIcon,
  ChartBarIcon,
  TrophyIcon
} from 'react-native-heroicons/outline';

export default function ProgressDashboardScreen({ navigation }) {
  const { statistics, progress, loading, refreshStatistics, refreshProgress } = useProgress();
  const { enrollments } = useEnrollment();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshStatistics(), refreshProgress()]);
    setRefreshing(false);
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
    <View className={`bg-${color}-50 rounded-2xl p-4 flex-1 mx-1 mb-3`}>
      <View className="flex-row items-center mb-2">
        <View className={`bg-${color}-100 p-2 rounded-lg mr-2`}>
          <Icon size={20} color={getColorValue(color)} />
        </View>
        <Text className={`text-${color}-600 font-semibold text-sm`}>{title}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
      {subtitle && <Text className="text-gray-500 text-xs mt-1">{subtitle}</Text>}
    </View>
  );

  const ProgressCard = ({ course }) => {
    const courseProgress = progress[course.id] || {
      progressPercentage: 0,
      completedMaterials: 0,
      timeSpent: 0
    };

    return (
      <TouchableOpacity 
        className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200"
        onPress={() => navigation.navigate('CourseProgress', { course })}
      >
        <View className="flex-row items-center">
          <View className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center mr-4">
            <BookOpenIcon size={24} color="#3b82f6" />
          </View>
          
          <View className="flex-1">
            <Text className="font-bold text-gray-800 text-lg" numberOfLines={2}>
              {course.course_name || course.name}
            </Text>
            <Text className="text-gray-500 text-sm mt-1">
              {courseProgress.completedMaterials} materials completed
            </Text>
            
            {/* Progress Bar */}
            <View className="mt-2">
              <View className="flex-row justify-between mb-1">
                <Text className="text-gray-600 text-sm">Progress</Text>
                <Text className="text-gray-600 text-sm">{courseProgress.progressPercentage}%</Text>
              </View>
              <View className="w-full bg-gray-200 rounded-full h-2">
                <View 
                  className="bg-primary-600 h-2 rounded-full"
                  style={{ width: `${courseProgress.progressPercentage}%` }}
                />
              </View>
            </View>

            {/* Time Spent */}
            <View className="flex-row items-center mt-2">
              <ClockIcon size={14} color="#6b7280" />
              <Text className="text-gray-500 text-xs ml-1">
                {courseProgress.timeSpent || 0} min spent
              </Text>
              {courseProgress.lastAccessed && (
                <Text className="text-gray-400 text-xs ml-3">
                  Last: {new Date(courseProgress.lastAccessed).toLocaleDateString()}
                </Text>
              )}
            </View>
          </View>

          {/* Completion Status */}
          <View className={`w-8 h-8 rounded-full items-center justify-center ${
            courseProgress.progressPercentage === 100 ? 'bg-success-100' : 'bg-primary-100'
          }`}>
            {courseProgress.progressPercentage === 100 ? (
              <TrophyIcon size={16} color="#10b981" />
            ) : (
              <AcademicCapIcon size={16} color="#3b82f6" />
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getColorValue = (color) => {
    const colors = {
      primary: '#3b82f6',
      success: '#10b981',
      warning: '#f59e0b',
      error: '#ef4444'
    };
    return colors[color];
  };

  if (loading && !statistics) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading your progress...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Learning Progress</Text>
            <Text className="text-gray-500">Track your learning journey</Text>
          </View>
          <View className="bg-primary-100 p-2 rounded-full">
            <ChartBarIcon size={24} color="#3b82f6" />
          </View>
        </View>
      </View>

      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Statistics */}
        <View className="px-6 mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Overall Statistics</Text>
          
          {statistics ? (
            <View>
              <View className="flex-row flex-wrap -mx-1">
                <StatCard
                  icon={BookOpenIcon}
                  title="Courses"
                  value={statistics.totalCourses}
                  subtitle="Total enrolled"
                  color="primary"
                />
                <StatCard
                  icon={CheckCircleIcon}
                  title="Completed"
                  value={statistics.completedCourses}
                  subtitle="Courses finished"
                  color="success"
                />
              </View>
              
              <View className="flex-row flex-wrap -mx-1">
                <StatCard
                  icon={AcademicCapIcon}
                  title="In Progress"
                  value={statistics.inProgressCourses}
                  subtitle="Active learning"
                  color="warning"
                />
                <StatCard
                  icon={ClockIcon}
                  title="Time Spent"
                  value={`${Math.round(statistics.totalTimeSpent / 60)}h`}
                  subtitle="Total learning"
                  color="error"
                />
              </View>

              <View className="bg-white rounded-2xl p-4 mt-3 shadow-sm border border-gray-200">
                <Text className="font-semibold text-gray-800 mb-2">Learning Summary</Text>
                <View className="flex-row justify-between">
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-primary-600">
                      {statistics.averageProgress}%
                    </Text>
                    <Text className="text-gray-500 text-xs">Avg Progress</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-success-600">
                      {statistics.totalMaterialsCompleted}
                    </Text>
                    <Text className="text-gray-500 text-xs">Materials Done</Text>
                  </View>
                  <View className="items-center">
                    <Text className="text-2xl font-bold text-warning-600">
                      {statistics.inProgressCourses}
                    </Text>
                    <Text className="text-gray-500 text-xs">Active Courses</Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              <ChartBarIcon size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No Progress Yet
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Start learning to see your progress statistics
              </Text>
            </View>
          )}
        </View>

        {/* Course Progress */}
        <View className="px-6 mt-6 mb-8">
          <Text className="text-xl font-bold text-gray-800 mb-4">Course Progress</Text>
          
          {enrollments.length > 0 ? (
            enrollments.map((course) => (
              <ProgressCard key={course.id} course={course} />
            ))
          ) : (
            <View className="bg-white rounded-2xl p-8 items-center">
              <AcademicCapIcon size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No Enrollments
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Enroll in courses to start tracking your progress
              </Text>
              <TouchableOpacity 
                className="bg-primary-600 rounded-xl px-6 py-3 mt-4"
                onPress={() => navigation.navigate('CourseList')}
              >
                <Text className="text-white font-semibold">Browse Courses</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
}