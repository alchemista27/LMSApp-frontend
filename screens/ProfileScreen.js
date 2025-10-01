import React, { useContext } from "react";
import { View, Text } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function ProfileScreen() {
  const { user } = useContext(AuthContext);

  if (!user) return <Text style={{ color: '#fff', padding: 16 }}>Not logged in</Text>;

  return (
    <View style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 20, fontWeight: 'bold' }}>Profile</Text>
      <Text style={{ color: '#ccc', marginTop: 8 }}>Email: {user.email}</Text>
      <Text style={{ color: '#ccc', marginTop: 4 }}>Role: {user.role}</Text>
    </View>
  );
}
