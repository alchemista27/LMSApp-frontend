// src/screens/user/ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Switch
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import {
  UserIcon,
  CogIcon,
  BellIcon,
  ShieldCheckIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  AcademicCapIcon,
  BookOpenIcon,
  ClockIcon
} from 'react-native-heroicons/outline';

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', onPress: logout, style: 'destructive' }
      ]
    );
  };

  const MenuItem = ({ icon: Icon, title, subtitle, onPress, showArrow = true, rightComponent }) => (
    <TouchableOpacity 
      className="flex-row items-center py-4 px-6 bg-white border-b border-gray-200"
      onPress={onPress}
      disabled={!onPress}
    >
      <View className="w-10 h-10 bg-primary-50 rounded-lg items-center justify-center mr-4">
        <Icon size={20} color="#3b82f6" />
      </View>
      <View className="flex-1">
        <Text className="font-semibold text-gray-800 text-base">{title}</Text>
        {subtitle && (
          <Text className="text-gray-500 text-sm mt-1">{subtitle}</Text>
        )}
      </View>
      {rightComponent ? (
        rightComponent
      ) : showArrow && (
        <ArrowRightOnRectangleIcon size={20} color="#9ca3af" style={{ transform: [{ rotate: '180deg' }] }} />
      )}
    </TouchableOpacity>
  );

  const StatItem = ({ icon: Icon, label, value }) => (
    <View className="flex-1 bg-primary-50 rounded-xl p-4 mx-1">
      <View className="flex-row items-center mb-2">
        <Icon size={18} color="#3b82f6" />
        <Text className="text-primary-600 font-medium text-sm ml-2">{label}</Text>
      </View>
      <Text className="text-2xl font-bold text-gray-800">{value}</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 shadow-sm">
        <View className="px-6">
          <Text className="text-2xl font-bold text-gray-800">Profile</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View className="bg-white mx-6 my-6 rounded-2xl p-6 shadow-sm">
          <View className="flex-row items-center">
            <View className="w-20 h-20 bg-primary-100 rounded-full items-center justify-center mr-4">
              <UserIcon size={32} color="#3b82f6" />
            </View>
            <View className="flex-1">
              <Text className="text-xl font-bold text-gray-800">
                {user?.firstname} {user?.lastname}
              </Text>
              <Text className="text-gray-500 text-base mt-1">{user?.email}</Text>
              <View className="flex-row items-center mt-2">
                <View className={`px-3 py-1 rounded-full ${
                  user?.role === 'admin' ? 'bg-success-100' : 'bg-primary-100'
                }`}>
                  <Text className={`text-xs font-medium ${
                    user?.role === 'admin' ? 'text-success-700' : 'text-primary-700'
                  }`}>
                    {user?.role?.toUpperCase()}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Learning Stats */}
        <View className="px-6 mb-6">
          <Text className="text-lg font-bold text-gray-800 mb-4">Learning Stats</Text>
          <View className="flex-row space-x-3">
            <StatItem
              icon={BookOpenIcon}
              label="Courses"
              value="5"
            />
            <StatItem
              icon={AcademicCapIcon}
              label="Completed"
              value="2"
            />
            <StatItem
              icon={ClockIcon}
              label="Hours"
              value="24"
            />
          </View>
        </View>

        {/* Preferences Section */}
        <View className="bg-white rounded-2xl mx-6 mb-6 overflow-hidden">
          <Text className="text-lg font-bold text-gray-800 p-6 pb-4">Preferences</Text>
          
          <MenuItem
            icon={BellIcon}
            title="Notifications"
            subtitle="Receive course updates and reminders"
            rightComponent={
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: '#f3f4f6', true: '#3b82f6' }}
                thumbColor={notifications ? '#ffffff' : '#f3f4f6'}
              />
            }
          />
          
          <MenuItem
            icon={CogIcon}
            title="Dark Mode"
            subtitle="Switch to dark theme"
            rightComponent={
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                trackColor={{ false: '#f3f4f6', true: '#3b82f6' }}
                thumbColor={darkMode ? '#ffffff' : '#f3f4f6'}
              />
            }
          />
        </View>

        {/* Support Section */}
        <View className="bg-white rounded-2xl mx-6 mb-6 overflow-hidden">
          <Text className="text-lg font-bold text-gray-800 p-6 pb-4">Support</Text>
          
          <MenuItem
            icon={ShieldCheckIcon}
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Privacy policy content...')}
          />
          
          <MenuItem
            icon={QuestionMarkCircleIcon}
            title="Help & Support"
            onPress={() => Alert.alert('Help & Support', 'Contact support...')}
          />
        </View>

        {/* Account Section */}
        <View className="bg-white rounded-2xl mx-6 mb-8 overflow-hidden">
          <Text className="text-lg font-bold text-gray-800 p-6 pb-4">Account</Text>
          
          <MenuItem
            icon={UserIcon}
            title="Edit Profile"
            onPress={() => navigation.navigate('EditProfile')}
          />
          
          <MenuItem
            icon={ArrowRightOnRectangleIcon}
            title="Logout"
            subtitle="Sign out from your account"
            onPress={handleLogout}
            showArrow={false}
          />
        </View>
      </ScrollView>
    </View>
  );
}