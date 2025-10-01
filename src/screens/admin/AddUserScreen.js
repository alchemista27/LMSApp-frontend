// src/screens/admin/AddUserScreen.js
import React, { useState } from 'react';
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

export default function AddUserScreen({ navigation, route }) {
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

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    const { firstname, lastname, email, password, confirmPassword } = formData;

    if (!firstname.trim() || !lastname.trim() || !email.trim() || !password) {
      Alert.alert('Error', 'Please fill all required fields');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return false;
    }

    if (password.length < 6) {
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
      const userData = {
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role
      };

      // Note: Backend register endpoint doesn't accept role directly
      // We'll need to create user then update role if different from default
      const response = await userService.register(userData);
      
      // If role is admin, we need to update user role
      if (formData.role === 'admin') {
        // In a real app, you'd have an endpoint to update user role
        // For now, we'll show success message
        Alert.alert(
          'Success', 
          'User created successfully! Admin role needs to be assigned manually.',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      } else {
        Alert.alert(
          'Success', 
          'User created successfully!',
          [{ text: 'OK', onPress: () => navigation.goBack() }]
        );
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create user';
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
          <Text className="text-2xl font-bold text-gray-800">Add New User</Text>
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
            <Text className="text-lg font-bold text-gray-800 mb-4">Security</Text>

            <InputField
              icon={KeyIcon}
              label="Password *"
              placeholder="Enter password (min. 6 characters)"
              value={formData.password}
              onChange={(value) => handleChange('password', value)}
              secureTextEntry={!showPassword}
              showToggle={true}
              onToggle={() => setShowPassword(!showPassword)}
            />

            <InputField
              icon={KeyIcon}
              label="Confirm Password *"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={(value) => handleChange('confirmPassword', value)}
              secureTextEntry={!showConfirmPassword}
              showToggle={true}
              onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            {/* Submit Button */}
            <TouchableOpacity
              className={`bg-primary-600 rounded-xl py-4 mt-2 flex-row justify-center items-center ${
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
                    Create User
                  </Text>
                </>
              )}
            </TouchableOpacity>

            {/* Form Guidelines */}
            <View className="mt-6 p-4 bg-blue-50 rounded-xl">
              <Text className="text-primary-700 font-semibold mb-2">Guidelines:</Text>
              <Text className="text-primary-600 text-sm">• All fields marked with * are required</Text>
              <Text className="text-primary-600 text-sm">• Password must be at least 6 characters long</Text>
              <Text className="text-primary-600 text-sm">• User role determines system access level</Text>
              <Text className="text-primary-600 text-sm">• Admin users have full system control</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}