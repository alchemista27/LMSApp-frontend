// screens/CourseDetailScreen.js
import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { getCourseDetail, enrollCourse } from "../api";
import { AuthContext } from "../context/AuthContext";
import CourseMaterial from "../components/CourseMaterial";

export default function CourseDetailScreen({ route }) {
  const { courseId } = route.params;
  const { user } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourseDetail(courseId);
      setCourse(data);
    };
    fetch();
  }, []);

  const handleEnroll = async () => {
    if (!user) return;
    const res = await enrollCourse(courseId, user.token);
    if (res) Alert.alert("Success", "Enroll berhasil!");
  };

  if (!course) return <Text className="text-white p-4">Loading...</Text>;

  return (
    <ScrollView className="bg-dark p-4">
      <Text className="text-white text-2xl font-bold mb-2">{course.title}</Text>
      <Text className="text-graycustom mb-4">{course.description}</Text>

      {course.materials?.map((m) => (
        <CourseMaterial key={m.id} material={m} />
      ))}

      {user && (
        <TouchableOpacity
          className="bg-primary py-3 rounded mt-4"
          onPress={handleEnroll}
        >
          <Text className="text-white text-center font-bold">Enroll</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
