import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { loginUser } from "../api";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginUser(email, password);
    if (res?.token) login(res.user, res.token);
    else alert(res?.message || "Login gagal");
  };

  return (
    <View className="flex-1 justify-center p-6 bg-secondary">
      <Text className="text-white text-3xl mb-4">Login</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="bg-graycustom p-2 rounded mb-2"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="bg-graycustom p-2 rounded mb-4"/>
      <TouchableOpacity onPress={handleLogin} className="bg-primary p-3 rounded mb-2">
        <Text className="text-white text-center font-bold">Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text className="text-primary text-center">Belum punya akun? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
