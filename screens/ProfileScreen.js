import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-2">Profile</Text>
      <Text className="text-gray-300 mb-1">Name: {user.firstname} {user.lastname}</Text>
      <Text className="text-gray-300 mb-1">Email: {user.email}</Text>
      <Text className="text-gray-300 mb-1">Role: {user.role}</Text>
    </View>
  );
}
