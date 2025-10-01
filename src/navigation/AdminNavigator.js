// src/navigation/AdminNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import UserManagementScreen from '../screens/admin/UserManagementScreen';
import CourseManagementScreen from '../screens/admin/CourseManagementScreen';
import {
  ChartBarIcon,
  UsersIcon,
  BookOpenIcon,
  CogIcon
} from 'react-native-heroicons/outline';
import AddUserScreen from '../screens/admin/AddUserScreen';
import EditUserScreen from '../screens/admin/EditUserScreen';
import AddCourseScreen from '../screens/admin/AddCourseScreen';
import EditCourseScreen from '../screens/admin/EditCourseScreen';
import SectionManagementScreen from '../screens/admin/SectionManagementScreen';
import AddSectionScreen from '../screens/admin/AddSectionScreen';
import AddMaterialScreen from '../screens/admin/AddMaterialScreen';
import EditSectionScreen from '../screens/admin/EditSectionScreen';
import EditMaterialScreen from '../screens/admin/EditMaterialScreen';
import VideoUploadScreen from '../screens/admin/VideoUploadScreen';
import PDFUploadScreen from '../screens/admin/PDFUploadScreen';
import ImageUploadScreen from '../screens/admin/ImageUploadScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="UserManagement" component={UserManagementScreen} />
      <Stack.Screen name="CourseManagement" component={CourseManagementScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
      <Stack.Screen name="CourseSections" component={SectionManagementScreen} />
      <Stack.Screen name="AddSection" component={AddSectionScreen} />
      <Stack.Screen name="AddMaterial" component={AddMaterialScreen} />
      <Stack.Screen name="EditSection" component={EditSectionScreen} />
      <Stack.Screen name="EditMaterial" component={EditMaterialScreen} />
      <Stack.Screen name="VideoUpload" component={VideoUploadScreen} />
      <Stack.Screen name="PDFUpload" component={PDFUploadScreen} />
      <Stack.Screen name="ImageUpload" component={ImageUploadScreen} />
    </Stack.Navigator>
  );
}

function UsersStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="UserManagementMain" component={UserManagementScreen} />
      <Stack.Screen name="AddUser" component={AddUserScreen} />
      <Stack.Screen name="EditUser" component={EditUserScreen} />
    </Stack.Navigator>
  );
}

function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CourseManagementMain" component={CourseManagementScreen} />
      <Stack.Screen name="AddCourse" component={AddCourseScreen} />
      <Stack.Screen name="EditCourse" component={EditCourseScreen} />
      <Stack.Screen name="CourseSections" component={SectionManagementScreen} />
      <Stack.Screen name="AddSection" component={AddSectionScreen} />
      <Stack.Screen name="AddMaterial" component={AddMaterialScreen} />
      <Stack.Screen name="EditSection" component={EditSectionScreen} />
      <Stack.Screen name="EditMaterial" component={EditMaterialScreen} />
    </Stack.Navigator>
  );
}

export default function AdminNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            return <ChartBarIcon size={size} color={color} />;
          } else if (route.name === 'Users') {
            return <UsersIcon size={size} color={color} />;
          } else if (route.name === 'Courses') {
            return <BookOpenIcon size={size} color={color} />;
          } else if (route.name === 'Settings') {
            return <CogIcon size={size} color={color} />;
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
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Users" component={UsersStack} />
      <Tab.Screen name="Courses" component={CoursesStack} />
    </Tab.Navigator>
  );
}