// src/services/enrollmentService.js
import api from './api';

class EnrollmentService {
  // Get user's enrolled courses
  async getMyEnrollments() {
    try {
      // In a real app, you'd have an endpoint like /api/enrollments/me
      // For now, we'll mock this or use existing courses endpoint
      const response = await api.get('/courses');
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to get enrollments'
      };
    }
  }

  // Enroll in a course
  async enrollInCourse(courseId) {
    try {
      // In a real app, you'd have: POST /api/enrollments/{courseId}
      // For now, we'll simulate successful enrollment
      // Replace with actual API call when backend endpoint is ready
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return {
        success: true,
        message: 'Successfully enrolled in course'
      };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Failed to enroll in course'
      };
    }
  }

  // Check if user is enrolled in a course
  async checkEnrollment(courseId) {
    try {
      // In a real app: GET /api/enrollments/check/{courseId}
      // For now, mock response
      const enrolledCourses = await this.getMyEnrollments();
      const isEnrolled = enrolledCourses.data?.some(course => course.id === courseId);
      
      return {
        success: true,
        enrolled: isEnrolled
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to check enrollment status'
      };
    }
  }

  // Get course progress
  async getCourseProgress(courseId) {
    try {
      // Mock progress data - replace with actual API
      const progress = {
        completedMaterials: Math.floor(Math.random() * 10),
        totalMaterials: 15,
        progressPercentage: Math.floor(Math.random() * 100),
        lastAccessed: new Date().toISOString()
      };
      
      return {
        success: true,
        data: progress
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get course progress'
      };
    }
  }
}

export default new EnrollmentService();