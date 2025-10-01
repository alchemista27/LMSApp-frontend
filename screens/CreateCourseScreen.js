import React, { useState } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

export default function CreateCourseScreen() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    alert("Fitur create course belum terhubung API");
  };

  return (
    <View className="flex-1 bg-secondary p-4">
      <Text className="text-white text-2xl mb-4">Create Course</Text>
      <TextInput placeholder="Title" value={title} onChangeText={setTitle} className="bg-graycustom p-2 rounded mb-2"/>
      <TextInput placeholder="Description" value={description} onChangeText={setDescription} className="bg-graycustom p-2 rounded mb-4"/>
      <TouchableOpacity onPress={handleCreate} className="bg-primary p-3 rounded">
        <Text className="text-white text-center font-bold">Create</Text>
      </TouchableOpacity>
    </View>
  );
}
