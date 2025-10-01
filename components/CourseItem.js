import React, { useContext, useState } from "react";
import { View, Text, Image, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { BASE_URL } from "../api";

export default function CourseItem({ course, onEnroll }) {
  const { token } = useContext(AuthContext);
  const [enrolled, setEnrolled] = useState(course.enrolled || false);
  const [loading, setLoading] = useState(false);

  const thumbnail = course.thumbnail || "https://via.placeholder.com/150/1ABC9C/ffffff?text=Course";

  const handleEnroll = async () => {
    if (loading) return;
    try {
      setLoading(true);
      await axios.post(
        `${BASE_URL}/enroll`,
        { courseId: course.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEnrolled(true);
      Alert.alert("Success", `Berhasil enroll di ${course.title}`);
      if (onEnroll) onEnroll(course.id);
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="bg-gray-800 rounded-xl p-4 mb-4 flex-row shadow-md">
      <Image
        source={{ uri: thumbnail }}
        className="w-24 h-24 rounded-lg mr-4"
        resizeMode="cover"
      />
      <View className="flex-1 justify-between">
        <Text className="text-white text-lg font-bold mb-1">{course.title}</Text>
        <Text className="text-gray-400 text-sm line-clamp-3 mb-2">
          {course.description || "No description available."}
        </Text>
        <View className="flex-row items-center justify-between">
          <Text className={`text-sm ${enrolled ? "text-tosca" : "text-gray-300"}`}>
            {enrolled ? "Enrolled" : "Not Enrolled"}
          </Text>
          {!enrolled && (
            <TouchableOpacity
              className="bg-tosca px-4 py-1 rounded"
              onPress={handleEnroll}
            >
              <Text className="text-black font-semibold">{loading ? "..." : "Enroll"}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}
