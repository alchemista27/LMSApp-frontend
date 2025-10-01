// src/screens/admin/EditUserScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator
} from 'react-native';
import { userService } from '../../services/api';
import {
  ChevronLeftIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  EnvelopeIcon,
  KeyIcon,
  ShieldCheckIcon
} from 'react-native-heroicons/outline';

export default function EditUserScreen({ navigation, route }) {
  const { user } = route.params;
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    if (user) {
      setFormData({
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        email: user.email || '',
        password: '',
        confirmPassword: '',
        role: user.role || 'user'
      });
      setInitialLoad(false);
    }
  }, [user]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstname, lastname, email, password, confirmPassword } = formData;

    if (!firstname.trim() || !lastname.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password && password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const updateData = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        role: formData.role
      };

      // Only include password if it's provided
      if (formData.password) {
        updateData.password = formData.password;
      }

      await userService.updateUser(user.id, updateData);
      
      Alert.alert(
        'Success', 
        'User updated successfully!',
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user';
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ icon: Icon, label, placeholder, value, onChange, secureTextEntry, showToggle, onToggle, ...props }) => (
    <View className="mb-4">
      <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      <View className="relative">
        <View className="absolute left-4 top-4 z-10">
          <Icon size={20} color="#6b7280" />
        </View>
        <TextInput
          className="bg-gray-50 border border-gray-300 rounded-xl px-12 py-4 text-base"
          placeholder={placeholder}
          value={value}
          onChangeText={onChange}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {showToggle && (
          <TouchableOpacity 
            className="absolute right-4 top-4"
            onPress={onToggle}
          >
            {secureTextEntry ? (
              <EyeSlashIcon size={20} color="#6b7280" />
            ) : (
              <EyeIcon size={20} color="#6b7280" />
            )}
          </TouchableOpacity>
        )}
      </View>
    </View>
  );

  if (initialLoad) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="text-gray-600 mt-4">Loading user data...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            className="mr-4"
          >
            <ChevronLeftIcon size={24} color="#374151" />
          </TouchableOpacity>
          <View>
            <Text className="text-2xl font-bold text-gray-800">Edit User</Text>
            <Text className="text-gray-500">{user.email}</Text>
          </View>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="px-6 pt-6">
          {/* Form Container */}
          <View className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            {/* Personal Information */}
            <Text className="text-lg font-bold text-gray-800 mb-4">Personal Information</Text>
            
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <InputField
                  icon={UserIcon}
                  label="First Name *"
                  placeholder="Enter first name"
                  value={formData.firstname}
                  onChange={(value) => handleChange('firstname', value)}
                  autoCapitalize="words"
                />
              </View>
              <View className="flex-1">
                <InputField
                  icon={UserIcon}
                  label="Last Name *"
                  placeholder="Enter last name"
                  value={formData.lastname}
                  onChange={(value) => handleChange('lastname', value)}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <InputField
              icon={EnvelopeIcon}
              label="Email Address *"
              placeholder="Enter email address"
              value={formData.email}
              onChange={(value) => handleChange('email', value)}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            {/* Role Selection */}
            <View className="mb-6">
              <Text className="text-gray-700 mb-2 font-medium">Role *</Text>
              <View className="flex-row space-x-3">
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    formData.role === 'user' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleChange('role', 'user')}
                >
                  <ShieldCheckIcon 
                    size={20} 
                    color={formData.role === 'user' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text className={`ml-2 font-medium ${
                    formData.role === 'user' ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    User
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-xl border-2 ${
                    formData.role === 'admin' 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-gray-300 bg-white'
                  }`}
                  onPress={() => handleChange('role', 'admin')}
                >
                  <ShieldCheckIcon 
                    size={20} 
                    color={formData.role === 'admin' ? '#3b82f6' : '#6b7280'} 
                  />
                  <Text className={`ml-2 font-medium ${
                    formData.role === 'admin' ? 'text-primary-600' : 'text-gray-600'
                  }`}>
                    Admin
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Password Section */}
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Change Password (Optional)
            </Text>

            <InputField
              icon={KeyIcon}
              label="New Password"
              placeholder="Leave blank to keep current password"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <InputField
              icon={KeyIcon}
              label="Confirm New Password"
              placeholder="Confirm new password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              showToggle={true}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Action Buttons */}
            <View className="flex-row space-x-3 mt-6">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-xl py-4 flex-row justify-center items-center"
                onPress={() => navigation.goBack()}
              >
                <Text className="text-gray-700 font-semibold text-lg">Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                className={`flex-1 bg-primary-600 rounded-xl py-4 flex-row justify-center items-center ${
                  loading ? 'opacity-50' : ''
                }`}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <>
                    <UserIcon size={20} color="white" />
                    <Text className="text-white font-semibold text-lg ml-2">
                      Update User
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* User Information */}
            <View className="mt-6 p-4 bg-gray-50 rounded-xl">
              <Text className="text-gray-700 font-semibold mb-2">User Information:</Text>
              <Text className="text-gray-600 text-sm">User ID: {user.id}</Text>
              <Text className="text-gray-600 text-sm">
                Created: {new Date(user.created_at).toLocaleDateString()}
              </Text>
              <Text className="text-gray-600 text-sm">
                Last Updated: {new Date(user.updated_at).toLocaleDateString()}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}