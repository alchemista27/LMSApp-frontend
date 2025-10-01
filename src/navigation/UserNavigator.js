// src/navigation/UserNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import DashboardScreen from '../screens/user/DashboardScreen';
import CourseListScreen from '../screens/user/CourseListScreen';
import ProfileScreen from '../screens/user/ProfileScreen';
import CourseDetailScreen from '../screens/user/CourseDetailScreen';
import {
  HomeIcon,
  BookOpenIcon,
  UserIcon
} from 'react-native-heroicons/outline';
import EnhancedVideoPlayerScreen from '../screens/user/EnhancedVideoPlayerScreen';
import EnhancedPDFViewerScreen from '../screens/user/EnhancedPDFViewerScreen';
import ProgressDashboardScreen from '../screens/user/ProgressDashboardScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="CourseList" component={CourseListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
      <Stack.Screen name="VideoPlayer" component={EnhancedVideoPlayerScreen} />
      <Stack.Screen name="PDFViewer" component={EnhancedPDFViewerScreen} />
      <Stack.Screen name="ProgressDashboard" component={ProgressDashboardScreen} />
    </Stack.Navigator>
  );
}

function CourseStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseListMain" component={CourseListScreen} />
      <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
      <Stack.Screen name="VideoPlayer" component={VideoPlayerScreen} />
      <Stack.Screen name="PDFViewer" component={PDFViewerScreen} />
    </Stack.Navigator>
  );
}

export default function UserNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            return <HomeIcon size={size} color={color} />;
          } else if (route.name === 'Courses') {
            return <BookOpenIcon size={size} color={color} />;
          } else if (route.name === 'Profile') {
            return <UserIcon size={size} color={color} />;
          }
        },
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#6b7280',
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e5e7eb',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8
        },
        headerShown: false
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Courses" component={CourseStack} />
      <Tab.Screen name="Progress" component={ProgressDashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}