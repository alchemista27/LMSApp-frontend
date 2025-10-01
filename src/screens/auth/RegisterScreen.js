// src/screens/auth/RegisterScreen.js
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { EyeIcon, EyeSlashIcon } from 'react-native-heroicons/outline';

export default function RegisterScreen({ navigation }) {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleRegister = async () => {
    const { firstname, lastname, email, password, confirmPassword } = formData;

    // Validation
    if (!firstname || !lastname || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    const result = await register({ firstname, lastname, email, password });
    setLoading(false);

    if (result.success) {
      Alert.alert(
        'Registration Successful', 
        'Please login with your credentials',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } else {
      Alert.alert('Registration Failed', result.message);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center py-8">
          {/* Header */}
          <View className="items-center mb-8">
            <Text className="text-3xl font-bold text-primary-600 mb-2">
              Create Account
            </Text>
            <Text className="text-gray-600 text-center">
              Join us and start your learning journey
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            {/* Name Row */}
            <View className="flex-row space-x-4">
              <View className="flex-1">
                <Text className="text-gray-700 mb-2 font-medium">First Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-base"
                  placeholder="First Name"
                  value={formData.firstname}
                  onChangeText={(value) => handleChange('firstname', value)}
                />
              </View>
              <View className="flex-1">
                <Text className="text-gray-700 mb-2 font-medium">Last Name</Text>
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-base"
                  placeholder="Last Name"
                  value={formData.lastname}
                  onChangeText={(value) => handleChange('lastname', value)}
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Email</Text>
              <TextInput
                className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-base"
                placeholder="Enter your email"
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-base pr-12"
                  placeholder="Enter password (min. 6 characters)"
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon size={20} color="#6b7280" />
                  ) : (
                    <EyeIcon size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text className="text-gray-700 mb-2 font-medium">Confirm Password</Text>
              <View className="relative">
                <TextInput
                  className="bg-gray-50 border border-gray-300 rounded-xl px-4 py-4 text-base pr-12"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChangeText={(value) => handleChange('confirmPassword', value)}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity 
                  className="absolute right-4 top-4"
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon size={20} color="#6b7280" />
                  ) : (
                    <EyeIcon size={20} color="#6b7280" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {/* Register Button */}
            <TouchableOpacity
              className={`bg-primary-600 rounded-xl py-4 mt-4 ${loading ? 'opacity-50' : ''}`}
              onPress={handleRegister}
              disabled={loading}
            >
              <Text className="text-white text-center font-semibold text-lg">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {/* Login Link */}
            <View className="flex-row justify-center mt-6">
              <Text className="text-gray-600">Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text className="text-primary-600 font-semibold">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}