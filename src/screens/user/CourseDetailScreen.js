// src/screens/user/CourseDetailScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { courseService } from '../../services/api';
import { useEnrollment } from '../../context/EnrollmentContext';
import {
  ChevronLeftIcon,
  BookOpenIcon,
  ClockIcon,
  UserIcon,
  PlayIcon,
  DocumentTextIcon,
  CheckCircleIcon,
  AcademicCapIcon
} from 'react-native-heroicons/outline';

export default function CourseDetailScreen({ route, navigation }) {
  const { courseId } = route.params;
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});
  const { enrollInCourse, isEnrolled, getEnrolledCourse } = useEnrollment();
  const [enrolling, setEnrolling] = useState(false);

  const enrolled = isEnrolled(courseId);
  const enrolledCourse = getEnrolledCourse(courseId);

  const loadCourseDetail = async () => {
    try {
      const response = await courseService.getCourse(courseId);
      setCourse(response.data);
      
      // Auto-expand first section
      if (response.data.sections && response.data.sections.length > 0) {
        setExpandedSections({ [response.data.sections[0].id]: true });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load course details');
    } finally {
      setLoading(false);
    }
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleEnroll = async () => {
    setEnrolling(true);
    const result = await enrollInCourse(courseId);
    setEnrolling(false);

    if (result.success) {
      Alert.alert('Success', result.message);
    } else {
      Alert.alert('Enrollment Failed', result.error);
    }
  };

  const handleMaterialPress = (material) => {
    if (!enrolled) {
      Alert.alert('Enrollment Required', 'Please enroll in this course to access the materials.');
      return;
    }

    if (material.material_type === 'video') {
      navigation.navigate('VideoPlayer', { 
        videoUrl: material.material_url,
        title: material.title,
        courseId,
        materialId: material.id
      });
    } else if (material.material_type === 'pdf') {
      navigation.navigate('PDFViewer', { 
        pdfUrl: material.material_url,
        title: material.title,
        courseId,
        materialId: material.id
      });
    }
  };

  useEffect(() => {
    loadCourseDetail();
  }, [courseId]);

  const SectionItem = ({ section }) => (
    <View className="bg-white rounded-xl mb-3 overflow-hidden">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4 bg-gray-50"
        onPress={() => toggleSection(section.id)}
      >
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">
            {section.section_name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {section.materials?.length || 0} materials
            {enrolled && ` • ${Math.floor(Math.random() * section.materials?.length)} completed`}
          </Text>
        </View>
        <ChevronLeftIcon 
          size={20} 
          color="#6b7280" 
          style={{ 
            transform: [{ rotate: expandedSections[section.id] ? '-90deg' : '0deg' }] 
          }} 
        />
      </TouchableOpacity>

      {expandedSections[section.id] && section.materials && (
        <View className="px-4 pb-4">
          {section.materials.map((material, index) => (
            <TouchableOpacity
              key={material.id}
              className={`flex-row items-center p-3 rounded-lg ${
                index !== section.materials.length - 1 ? 'mb-2' : ''
              } ${enrolled ? 'bg-white border border-gray-200' : 'bg-gray-100'}`}
              onPress={() => handleMaterialPress(material)}
              disabled={!enrolled}
            >
              <View className={`w-10 h-10 rounded-lg items-center justify-center mr-3 ${
                enrolled ? 'bg-primary-50' : 'bg-gray-200'
              }`}>
                {material.material_type === 'video' ? (
                  <PlayIcon size={20} color={enrolled ? "#3b82f6" : "#9ca3af"} />
                ) : (
                  <DocumentTextIcon size={20} color={enrolled ? "#3b82f6" : "#9ca3af"} />
                )}
              </View>
              <View className="flex-1">
                <Text className={`font-medium ${enrolled ? 'text-gray-800' : 'text-gray-500'}`} numberOfLines={2}>
                  {material.title || material.material_name}
                </Text>
                <Text className="text-gray-500 text-xs mt-1 capitalize">
                  {material.material_type} • 15 min
                </Text>
              </View>
              <View>
                {enrolled ? (
                  <CheckCircleIcon size={20} color="#d1d5db" />
                ) : (
                  <Text className="text-gray-400 text-xs">Locked</Text>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading course...</Text>
      </View>
    );
  }

  if (!course) {
    return (
      <View className="flex-1 bg-white justify-center items-center">
        <Text className="text-gray-600">Course not found</Text>
      </View>
    );
  }

  const SectionItem = ({ section }) => (
    <View className="bg-white rounded-xl mb-3 overflow-hidden">
      <TouchableOpacity
        className="flex-row justify-between items-center p-4 bg-gray-50"
        onPress={() => toggleSection(section.id)}
      >
        <View className="flex-1">
          <Text className="font-semibold text-gray-800 text-lg">
            {section.section_name}
          </Text>
          <Text className="text-gray-500 text-sm mt-1">
            {section.materials?.length || 0} materials
          </Text>
        </View>
        <ChevronLeftIcon 
          size={20} 
          color="#6b7280" 
          style={{ 
            transform: [{ rotate: expandedSections[section.id] ? '-90deg' : '0deg' }] 
          }} 
        />
      </TouchableOpacity>

      {expandedSections[section.id] && section.materials && (
        <View className="px-4 pb-4">
          {section.materials.map((material, index) => (
            <TouchableOpacity
              key={material.id}
              className={`flex-row items-center p-3 rounded-lg ${
                index !== section.materials.length - 1 ? 'mb-2' : ''
              } bg-white border border-gray-200`}
              onPress={() => handleMaterialPress(material)}
            >
              <View className="w-10 h-10 rounded-lg bg-primary-50 items-center justify-center mr-3">
                {material.material_type === 'video' ? (
                  <PlayIcon size={20} color="#3b82f6" />
                ) : (
                  <DocumentTextIcon size={20} color="#3b82f6" />
                )}
              </View>
              <View className="flex-1">
                <Text className="font-medium text-gray-800" numberOfLines={2}>
                  {material.title || material.material_name}
                </Text>
                <Text className="text-gray-500 text-xs mt-1 capitalize">
                  {material.material_type} • 15 min
                </Text>
              </View>
              <CheckCircleIcon size={20} color="#d1d5db" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-4 shadow-sm">
        <View className="px-6 flex-row items-center">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800 flex-1" numberOfLines={2}>
            {course.course_name || course.name}
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Hero Section */}
        <View className="bg-white px-6 py-6 mb-4">
          <View className="w-20 h-20 bg-primary-100 rounded-2xl items-center justify-center mb-4">
            <BookOpenIcon size={32} color="#3b82f6" />
          </View>
          
          <Text className="text-2xl font-bold text-gray-800 mb-3">
            {course.course_name || course.name}
          </Text>
          
          <Text className="text-gray-600 text-base leading-6 mb-4">
            {course.description || 'No description available.'}
          </Text>

          {/* Enrollment Status */}
          {enrolled && (
            <View className="bg-success-50 rounded-xl p-3 mb-4 flex-row items-center">
              <AcademicCapIcon size={20} color="#10b981" />
              <Text className="text-success-700 font-medium ml-2">
                ✓ You are enrolled in this course
              </Text>
            </View>
          )}

          {/* Course Stats */}
          <View className="flex-row space-x-6 mb-4">
            <View className="flex-row items-center">
              <ClockIcon size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">
                {course.total_times || '0'} hours
              </Text>
            </View>
            <View className="flex-row items-center">
              <UserIcon size={18} color="#6b7280" />
              <Text className="text-gray-600 ml-2">
                {course.total_video || 0} videos
              </Text>
            </View>

            {enrolled && (
              <View className="flex-row items-center">
                <CheckCircleIcon size={18} color="#10b981" />
                <Text className="text-success-600 ml-2 font-medium">
                  Enrolled
                </Text>
              </View>
            )}

          </View>

          {/* Learning Objectives */}
          {course.learning_objectives && (
            <View className="mb-4">
              <Text className="font-semibold text-gray-800 mb-2">
                What you'll learn
              </Text>
              <Text className="text-gray-600 leading-6">
                {course.learning_objectives}
              </Text>
            </View>
          )}

          {/* Advantages */}
          {course.advantages && (
            <View>
              <Text className="font-semibold text-gray-800 mb-2">
                Course Advantages
              </Text>
              <Text className="text-gray-600 leading-6">
                {course.advantages}
              </Text>
            </View>
          )}
        </View>

        {/* Course Content */}
        <View className="px-6 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Course Content
          </Text>
          
          {course.sections && course.sections.length > 0 ? (
            course.sections.map((section) => (
              <SectionItem key={section.id} section={section} />
            ))
          ) : (
            <View className="bg-white rounded-xl p-8 items-center">
              <DocumentTextIcon size={48} color="#d1d5db" />
              <Text className="text-gray-500 text-lg font-medium mt-4">
                No content available
              </Text>
              <Text className="text-gray-400 text-center mt-2">
                Course materials will be added soon
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Enrollment Button */}
      <View className="px-6 pb-6 pt-4 bg-white border-t border-gray-200">
        {enrolled ? (
          <View>
            <TouchableOpacity
              className="bg-success-500 rounded-xl py-4"
              onPress={() => navigation.navigate('CourseLearning', { courseId })}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Continue Learning
              </Text>
            </TouchableOpacity>
            <Text className="text-success-600 text-center mt-2 font-medium">
              You have access to all course materials
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            className={`bg-primary-600 rounded-xl py-4 flex-row justify-center items-center ${
              enrolling ? 'opacity-50' : ''
            }`}
            onPress={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <>
                <AcademicCapIcon size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Enroll in this Course
                </Text>
              </>
            )}
          </TouchableOpacity>
        )}
        
        {!enrolled && (
          <Text className="text-gray-500 text-center mt-2">
            Free enrollment • Lifetime access
          </Text>
        )}
      </View>
    </View>
  );
}