// src/navigation/AppNavigator.js
import React from 'react';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import UserNavigator from './UserNavigator';
import AdminNavigator from './AdminNavigator';
import LoadingScreen from '../screens/shared/LoadingScreen';
// Update src/navigation/AppNavigator.js
import AdminNavigator from './AdminNavigator';

export default function AppNavigator() {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <AuthNavigator />;
  }

  if (isAdmin) {
    return <AdminNavigator />;
  }

  return <UserNavigator />;
}