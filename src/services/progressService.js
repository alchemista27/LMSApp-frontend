// src/services/progressService.js
import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

class ProgressService {
  // Track material completion
  async markMaterialComplete(courseId, materialId) {
    try {
      // In a real app: POST /api/progress/materials/{materialId}/complete
      // For now, we'll use AsyncStorage to simulate progress tracking
      
      const key = `progress_${courseId}`;
      const existingProgress = await AsyncStorage.getItem(key);
      const progress = existingProgress ? JSON.parse(existingProgress) : {
        courseId,
        completedMaterials: [],
        lastAccessed: new Date().toISOString(),
        progressPercentage: 0
      };

      // Add material to completed if not already
      if (!progress.completedMaterials.includes(materialId)) {
        progress.completedMaterials.push(materialId);
        progress.lastAccessed = new Date().toISOString();
        
        // Calculate progress percentage (mock total materials)
        const totalMaterials = 15; // This should come from course data
        progress.progressPercentage = Math.round(
          (progress.completedMaterials.length / totalMaterials) * 100
        );

        await AsyncStorage.setItem(key, JSON.stringify(progress));
      }

      return {
        success: true,
        progress: progress
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to track progress'
      };
    }
  }

  // Get course progress
  async getCourseProgress(courseId) {
    try {
      const key = `progress_${courseId}`;
      const progress = await AsyncStorage.getItem(key);
      
      if (progress) {
        return {
          success: true,
          data: JSON.parse(progress)
        };
      } else {
        // Return default progress object
        return {
          success: true,
          data: {
            courseId,
            completedMaterials: [],
            lastAccessed: null,
            progressPercentage: 0,
            totalMaterials: 15, // Mock data
            timeSpent: 0 // in minutes
          }
        };
      }
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get progress'
      };
    }
  }

  // Get all user progress
  async getAllProgress() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const progressKeys = keys.filter(key => key.startsWith('progress_'));
      const progressData = await AsyncStorage.multiGet(progressKeys);
      
      const progress = progressData.map(([key, value]) => JSON.parse(value));
      return {
        success: true,
        data: progress
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to get all progress'
      };
    }
  }

  // Update time spent on course
  async updateTimeSpent(courseId, minutes) {
    try {
      const key = `progress_${courseId}`;
      const existingProgress = await AsyncStorage.getItem(key);
      const progress = existingProgress ? JSON.parse(existingProgress) : {
        courseId,
        completedMaterials: [],
        lastAccessed: new Date().toISOString(),
        progressPercentage: 0,
        timeSpent: 0
      };

      progress.timeSpent = (progress.timeSpent || 0) + minutes;
      progress.lastAccessed = new Date().toISOString();

      await AsyncStorage.setItem(key, JSON.stringify(progress));

      return {
        success: true,
        progress: progress
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update time spent'
      };
    }
  }

  // Check if material is completed
  async isMaterialCompleted(courseId, materialId) {
    try {
      const progress = await this.getCourseProgress(courseId);
      if (progress.success) {
        return {
          success: true,
          completed: progress.data.completedMaterials.includes(materialId)
        };
      }
      return { success: false, completed: false };
    } catch (error) {
      return { success: false, completed: false };
    }
  }

  // Calculate overall learning statistics
  async getLearningStatistics() {
    try {
      const progressResult = await this.getAllProgress();
      if (!progressResult.success) {
        return { success: false, error: progressResult.error };
      }

      const progressData = progressResult.data;
      const stats = {
        totalCourses: progressData.length,
        completedCourses: progressData.filter(p => p.progressPercentage === 100).length,
        inProgressCourses: progressData.filter(p => p.progressPercentage > 0 && p.progressPercentage < 100).length,
        totalTimeSpent: progressData.reduce((total, p) => total + (p.timeSpent || 0), 0),
        totalMaterialsCompleted: progressData.reduce((total, p) => total + p.completedMaterials.length, 0),
        averageProgress: progressData.length > 0 
          ? Math.round(progressData.reduce((sum, p) => sum + p.progressPercentage, 0) / progressData.length)
          : 0
      };

      return {
        success: true,
        data: stats
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to calculate statistics'
      };
    }
  }
}

export default new ProgressService();