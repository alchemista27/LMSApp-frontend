import React, { useEffect, useState, useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { getCourseDetail, enrollCourse } from "../api";
import { AuthContext } from "../context/AuthContext";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";

export default function CourseDetailScreen({ route }) {
  const { courseId } = route.params;
  const { user, token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    getCourseDetail(courseId).then(setCourse);
  }, [courseId]);

  if (!course) return <Text className="text-white p-4">Loading...</Text>;

  const handleEnroll = async () => {
    const res = await enrollCourse(course.id, token);
    alert(res?.message || "Enroll gagal");
  };

  return (
    <ScrollView className="flex-1 bg-secondary p-4">
      <Text className="text-white text-2xl font-bold mb-2">{course.title}</Text>
      <Text className="text-graycustom mb-4">{course.description}</Text>
      
      {course.materials?.map((m, idx) => (
        <View key={idx} className="mb-4">
          {m.type === "video" ? (
            <Video source={{ uri: m.url }} style={{ width: "100%", height: 200 }} useNativeControls resizeMode="contain"/>
          ) : (
            <WebView source={{ uri: m.url }} style={{ height: 400 }} />
          )}
        </View>
      ))}

      {user?.role === "user" && (
        <TouchableOpacity onPress={handleEnroll} className="bg-primary p-3 rounded mt-4">
          <Text className="text-white text-center font-bold">Enroll</Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}
