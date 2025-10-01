import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-white text-xl mb-2">Profil</Text>
      <Text className="text-graycustom">Nama: {user.firstname} {user.lastname}</Text>
      <Text className="text-graycustom">Email: {user.email}</Text>
      <Text className="text-graycustom">Role: {user.role}</Text>
    </View>
  );
}
