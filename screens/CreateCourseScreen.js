import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

export default function CreateCourseScreen() {
  const { token } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/courses", { title, description }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert("Success", "Course created!");
      setTitle("");
      setDescription("");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  return (
    <View className="flex-1 bg-gray-900 p-4">
      <Text className="text-white text-2xl font-bold mb-4">Create Course</Text>
      <TextInput placeholder="Title" placeholderTextColor="#aaa" value={title} onChangeText={setTitle} className="w-full p-3 mb-2 bg-gray-800 text-white rounded" />
      <TextInput placeholder="Description" placeholderTextColor="#aaa" value={description} onChangeText={setDescription} className="w-full p-3 mb-2 bg-gray-800 text-white rounded" />
      <TouchableOpacity onPress={handleCreate} className="bg-teal-600 p-3 rounded mt-4">
        <Text className="text-white font-bold text-center">Create Course</Text>
      </TouchableOpacity>
    </View>
  );
}
