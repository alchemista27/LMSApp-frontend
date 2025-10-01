// components/CourseItem.js
import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function CourseItem({ course, onPress }) {
  return (
    <TouchableOpacity
      className="bg-dark p-4 rounded mb-4"
      onPress={onPress}
    >
      <Text className="text-white font-bold text-lg">{course.title}</Text>
      <Text className="text-graycustom mt-1">{course.description}</Text>
    </TouchableOpacity>
  );
}
