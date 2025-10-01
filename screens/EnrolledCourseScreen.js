import React, { useEffect, useState, useContext } from "react";
import { ScrollView, Text } from "react-native";
import CourseItem from "../components/CourseItem";
import { getEnrolledCourses } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function EnrolledCoursesScreen({ navigation }) {
  const { token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    getEnrolledCourses(token).then(setCourses);
  }, [token]);

  return (
    <ScrollView className="flex-1 bg-secondary p-2">
      {courses.map((c) => (
        <CourseItem key={c.id} course={c} onPress={() => navigation.navigate("CourseDetail", { courseId: c.id })}/>
      ))}
      {courses.length === 0 && <Text className="text-graycustom text-center mt-4">Belum ada course</Text>}
    </ScrollView>
  );
}
