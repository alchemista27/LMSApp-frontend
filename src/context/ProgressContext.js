// src/context/ProgressContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import ProgressService from '../services/progressService';
import { useAuth } from './AuthContext';

const ProgressContext = createContext();

export const useProgress = () => useContext(ProgressContext);

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({});
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadAllProgress = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const result = await ProgressService.getAllProgress();
      if (result.success) {
        // Convert array to object with courseId as key
        const progressObj = {};
        result.data.forEach(p => {
          progressObj[p.courseId] = p;
        });
        setProgress(progressObj);
      }
    } catch (error) {
      console.error('Failed to load progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStatistics = async () => {
    if (!user) return;
    
    try {
      const result = await ProgressService.getLearningStatistics();
      if (result.success) {
        setStatistics(result.data);
      }
    } catch (error) {
      console.error('Failed to load statistics:', error);
    }
  };

  const markMaterialComplete = async (courseId, materialId) => {
    try {
      const result = await ProgressService.markMaterialComplete(courseId, materialId);
      if (result.success) {
        // Update local state
        setProgress(prev => ({
          ...prev,
          [courseId]: result.progress
        }));
        
        // Reload statistics
        await loadStatistics();
        
        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: 'Failed to mark material complete' };
    }
  };

  const getCourseProgress = (courseId) => {
    return progress[courseId] || {
      courseId,
      completedMaterials: [],
      progressPercentage: 0,
      timeSpent: 0,
      lastAccessed: null
    };
  };

  const updateTimeSpent = async (courseId, minutes) => {
    try {
      const result = await ProgressService.updateTimeSpent(courseId, minutes);
      if (result.success) {
        setProgress(prev => ({
          ...prev,
          [courseId]: result.progress
        }));
        await loadStatistics();
      }
    } catch (error) {
      console.error('Failed to update time spent:', error);
    }
  };

  const isMaterialCompleted = (courseId, materialId) => {
    const courseProgress = progress[courseId];
    return courseProgress ? courseProgress.completedMaterials.includes(materialId) : false;
  };

  useEffect(() => {
    if (user) {
      loadAllProgress();
      loadStatistics();
    } else {
      setProgress({});
      setStatistics(null);
    }
  }, [user]);

  const value = {
    progress,
    statistics,
    loading,
    markMaterialComplete,
    getCourseProgress,
    updateTimeSpent,
    isMaterialCompleted,
    refreshProgress: loadAllProgress,
    refreshStatistics: loadStatistics
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};