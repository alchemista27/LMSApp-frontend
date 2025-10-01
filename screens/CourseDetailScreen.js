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

  if (!course) return <Text style={{ color: '#fff', padding: 16 }}>Loading...</Text>;

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{course.title}</Text>
      <Text style={{ color: '#ccc', marginBottom: 16 }}>{course.description}</Text>

      {course.materials?.map((m) => (
        <CourseMaterial key={m.id} material={m} />
      ))}

      {user && (
        <TouchableOpacity
          style={{ backgroundColor: '#1abc9c', paddingVertical: 12, borderRadius: 8, marginTop: 16 }}
          onPress={handleEnroll}
        >
          <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Enroll</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
