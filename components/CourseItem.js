import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function CourseItem({ course, onPress }) {
  return (
    <TouchableOpacity
      style={{ backgroundColor: '#333', padding: 12, borderRadius: 8, marginBottom: 8 }}
      onPress={onPress}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>{course.title}</Text>
      <Text style={{ color: '#ccc', marginTop: 4 }}>{course.description}</Text>
    </TouchableOpacity>
  );
}
