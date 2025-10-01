import React from "react";
import { TouchableOpacity, Text, View } from "react-native";

export default function CourseItem({ course, onPress }) {
  return (
    <TouchableOpacity onPress={onPress} className="bg-secondary p-4 m-2 rounded-lg">
      <Text className="text-white text-lg font-bold">{course.title}</Text>
      <Text className="text-graycustom mt-1">{course.description}</Text>
    </TouchableOpacity>
  );
}
