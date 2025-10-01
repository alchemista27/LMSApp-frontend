import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user, logout } = useContext(AuthContext);

  if (!user) return <Text className="text-white p-4">User tidak ditemukan</Text>;

  return (
    <View className="flex-1 bg-dark p-4">
      <Text className="text-white text-2xl font-bold mb-4">Profile</Text>

      <View className="bg-gray-700 p-4 rounded mb-4">
        <Text className="text-white font-semibold">Name: {user.firstname} {user.lastname}</Text>
        <Text className="text-gray-300">Email: {user.email}</Text>
        <Text className="text-gray-300">Role: {user.role}</Text>
      </View>

      <TouchableOpacity
        className="bg-primary py-3 rounded"
        onPress={logout}
      >
        <Text className="text-white text-center font-bold">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
