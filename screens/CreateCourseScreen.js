import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function CreateCourseScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    if (!title || !description) {
      Alert.alert("Error", "Semua field harus diisi!");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/courses",
        { title, description },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      if (res.data) {
        Alert.alert("Sukses", "Course berhasil dibuat!");
        setTitle("");
        setDescription("");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Gagal membuat course");
    }
  };

  if (!user || user.role !== "admin") {
    return <Text className="text-white p-4">Anda tidak memiliki akses</Text>;
  }

  return (
    <View className="flex-1 bg-dark p-4">
      <Text className="text-white text-2xl font-bold mb-4">Create Course</Text>

      <Text className="text-gray-300 mb-2">Title</Text>
      <TextInput
        className="bg-gray-700 text-white p-3 rounded mb-4"
        value={title}
        onChangeText={setTitle}
      />

      <Text className="text-gray-300 mb-2">Description</Text>
      <TextInput
        className="bg-gray-700 text-white p-3 rounded mb-4"
        value={description}
        onChangeText={setDescription}
      />

      <TouchableOpacity
        className="bg-primary py-3 rounded"
        onPress={handleCreate}
      >
        <Text className="text-white text-center font-bold">Create Course</Text>
      </TouchableOpacity>
    </View>
  );
}
