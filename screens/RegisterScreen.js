import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        firstname, lastname, email, password
      });
      Alert.alert("Success", res.data.message);
      navigation.navigate("Login");
    } catch (err) {
      Alert.alert("Error", err.response?.data?.message || err.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-4">
      <Text className="text-white text-3xl font-bold mb-6">Register</Text>
      <TextInput placeholder="First Name" placeholderTextColor="#aaa" value={firstname} onChangeText={setFirstname} className="w-full p-3 mb-2 bg-gray-800 text-white rounded" />
      <TextInput placeholder="Last Name" placeholderTextColor="#aaa" value={lastname} onChangeText={setLastname} className="w-full p-3 mb-2 bg-gray-800 text-white rounded" />
      <TextInput placeholder="Email" placeholderTextColor="#aaa" value={email} onChangeText={setEmail} className="w-full p-3 mb-2 bg-gray-800 text-white rounded" />
      <TextInput placeholder="Password" placeholderTextColor="#aaa" value={password} onChangeText={setPassword} secureTextEntry className="w-full p-3 mb-4 bg-gray-800 text-white rounded" />
      <TouchableOpacity onPress={handleRegister} className="w-full bg-teal-600 p-3 rounded">
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}
