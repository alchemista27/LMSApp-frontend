// src/screens/admin/UserManagementScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  RefreshControl
} from 'react-native';
import { userService } from '../../services/api';
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  TrashIcon,
  UserIcon
} from 'react-native-heroicons/outline';

export default function UserManagementScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const response = await userService.getUsers();
      setUsers(response.data);
      setFilteredUsers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadUsers();
    setRefreshing(false);
  };

  const handleDeleteUser = (user) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${user.firstname} ${user.lastname}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await userService.deleteUser(user.id);
              Alert.alert('Success', 'User deleted successfully');
              loadUsers(); // Reload the list
            } catch (error) {
              Alert.alert('Error', 'Failed to delete user');
            }
          }
        }
      ]
    );
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = users.filter(user =>
        user.firstname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.lastname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(users);
    }
  }, [searchQuery, users]);

  const UserCard = ({ user }) => (
    <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm border border-gray-200">
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-primary-100 rounded-full items-center justify-center mr-4">
          <UserIcon size={24} color="#3b82f6" />
        </View>
        
        <View className="flex-1">
          <Text className="font-bold text-gray-800 text-lg">
            {user.firstname} {user.lastname}
          </Text>
          <Text className="text-gray-500 text-sm">{user.email}</Text>
          
          <View className="flex-row items-center mt-2">
            <View className={`px-2 py-1 rounded-full ${
              user.role === 'admin' ? 'bg-success-100' : 'bg-primary-100'
            }`}>
              <Text className={`text-xs font-medium ${
                user.role === 'admin' ? 'text-success-700' : 'text-primary-700'
              }`}>
                {user.role}
              </Text>
            </View>
            <Text className="text-gray-400 text-xs ml-3">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-end space-x-3 mt-4">
        <TouchableOpacity 
          className="bg-warning-50 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => navigation.navigate('EditUser', { user })}
        >
          <PencilIcon size={16} color="#f59e0b" />
          <Text className="text-warning-600 font-medium ml-2">Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          className="bg-error-50 px-4 py-2 rounded-lg flex-row items-center"
          onPress={() => handleDeleteUser(user)}
        >
          <TrashIcon size={16} color="#ef4444" />
          <Text className="text-error-600 font-medium ml-2">Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-600">Loading users...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 pt-12 pb-4 shadow-sm">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-2xl font-bold text-gray-800">User Management</Text>
          <TouchableOpacity 
            className="bg-primary-600 px-4 py-2 rounded-xl flex-row items-center"
            onPress={() => navigation.navigate('AddUser')}
          >
            <PlusIcon size={20} color="white" />
            <Text className="text-white font-semibold ml-2">Add User</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-xl px-4 py-3">
          <MagnifyingGlassIcon size={20} color="#9ca3af" />
          <TextInput
            className="flex-1 ml-2 text-base"
            placeholder="Search users by name, email, or role..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* User List */}
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
        className="flex-1 px-6 pt-4"
      >
        <Text className="text-gray-500 mb-4">
          {filteredUsers.length} users found
        </Text>

        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <UserCard key={user.id} user={user} />
          ))
        ) : (
          <View className="bg-white rounded-2xl p-8 items-center mt-8">
            <UserIcon size={64} color="#d1d5db" />
            <Text className="text-gray-500 text-xl font-medium mt-4">
              No users found
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              {searchQuery 
                ? `No results for "${searchQuery}"`
                : 'No users in the system'
              }
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}