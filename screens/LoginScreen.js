import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      if (res.token) {
        login(res.user, res.token);
      } else {
        Alert.alert("Login Failed", res.message || "Unknown error");
      }
    } catch (err) {
      Alert.alert("Error", err.message);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-900 p-4">
      <Text className="text-white text-3xl font-bold mb-6">Login</Text>
      <TextInput
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded"
      />
      <TextInput
        placeholder="Password"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="w-full p-3 mb-4 bg-gray-800 text-white rounded"
      />
      <TouchableOpacity onPress={handleLogin} className="w-full bg-teal-600 p-3 rounded">
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")} className="mt-4">
        <Text className="text-teal-400">Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
