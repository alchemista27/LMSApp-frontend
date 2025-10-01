import React, { useEffect, useState } from "react";
import { View, ScrollView, Text } from "react-native";
import CourseItem from "../components/CourseItem";
import { getCourses } from "../api";

export default function DashboardScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getCourses().then(setCourses);
  }, []);

  return (
    <ScrollView className="flex-1 bg-secondary p-2">
      {courses.map((course) => (
        <CourseItem key={course.id} course={course} onPress={() => navigation.navigate("CourseDetail", { courseId: course.id })}/>
      ))}
      {courses.length === 0 && <Text className="text-graycustom text-center mt-4">Tidak ada course</Text>}
    </ScrollView>
  );
}
