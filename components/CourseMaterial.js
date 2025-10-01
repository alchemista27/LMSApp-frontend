import React from "react";
import { View, Text } from "react-native";

export default function CourseMaterial({ material }) {
  return (
    <View style={{ backgroundColor: '#222', padding: 12, borderRadius: 8, marginBottom: 8 }}>
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{material.title}</Text>
      <Text style={{ color: '#ccc', marginTop: 4 }}>{material.content}</Text>
    </View>
  );
}
