import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { createCourse } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function CreateCourseScreen() {
  const { user } = useContext(AuthContext);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const handleCreate = async () => {
    const res = await createCourse({ title, description: desc }, user.token);
    if (res) {
      Alert.alert("Success", "Course created!");
      setTitle("");
      setDesc("");
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Create Course</Text>
      <TextInput
        placeholder="Course Title"
        placeholderTextColor="#888"
        value={title}
        onChangeText={setTitle}
        style={{ backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12 }}
      />
      <TextInput
        placeholder="Description"
        placeholderTextColor="#888"
        value={desc}
        onChangeText={setDesc}
        multiline
        style={{ backgroundColor: '#222', color: '#fff', padding: 12, borderRadius: 8, marginBottom: 12, height: 100 }}
      />
      <TouchableOpacity
        style={{ backgroundColor: '#1abc9c', padding: 12, borderRadius: 8 }}
        onPress={handleCreate}
      >
        <Text style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>Create</Text>
      </TouchableOpacity>
    </View>
  );
}
