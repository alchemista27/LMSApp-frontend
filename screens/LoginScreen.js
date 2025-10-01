import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center bg-dark px-6">
      <Text className="text-3xl font-bold text-primary mb-8">Login</Text>

      <Text className="text-light mb-2">Email</Text>
      <TextInput
        className="bg-gray-700 text-white p-3 rounded mb-4"
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor="#aaa"
      />

      <Text className="text-light mb-2">Password</Text>
      <TextInput
        className="bg-gray-700 text-white p-3 rounded mb-4"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        placeholderTextColor="#aaa"
      />

      <TouchableOpacity
        className="bg-primary py-3 rounded mb-4"
        onPress={() => login(email, password)}
      >
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-light text-center">Belum punya akun? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
