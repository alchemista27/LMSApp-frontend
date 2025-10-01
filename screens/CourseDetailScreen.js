import React, { useEffect, useState, useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getCourseDetail, enrollCourse } from "../api";
import { Video } from "expo-av";
import { WebView } from "react-native-webview";

export default function CourseDetailScreen({ route }) {
  const { courseId } = route.params;
  const { token } = useContext(AuthContext);
  const [course, setCourse] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      const data = await getCourseDetail(courseId, token);
      setCourse(data);
    }
    fetchDetail();
  }, []);

  const handleEnroll = async () => {
    try {
      await enrollCourse(courseId, token);
      Alert.alert("Success", "You are now enrolled!");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  if (!course) return <Text className="text-white p-4">Loading...</Text>;

  return (
    <ScrollView className="bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-2">{course.title}</Text>
      <Text className="text-gray-300 mb-4">{course.description}</Text>

      {course.materials?.map((mat, idx) => (
        <View key={idx} className="mb-4">
          {mat.type === "video" ? (
            <Video
              source={{ uri: mat.url }}
              useNativeControls
              style={{ width: "100%", height: 200 }}
            />
          ) : (
            <WebView source={{ uri: mat.url }} style={{ height: 400 }} />
          )}
        </View>
      ))}

      <TouchableOpacity onPress={handleEnroll} className="bg-teal-600 p-3 rounded mt-4">
        <Text className="text-white font-bold text-center">Enroll</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
