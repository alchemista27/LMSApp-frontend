import React, { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { loginUser } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function LoginScreen({ navigation }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const res = await loginUser(email, password);
    if (res?.token) {
      await login(email, password); // simpan user ke context
    } else {
      Alert.alert("Login gagal", res?.message || "Email atau password salah");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#111" }}>
      <Text style={{ color: "#fff", fontSize: 24, textAlign: "center", marginBottom: 20 }}>Login</Text>

      <TextInput
        placeholder="Email"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={{ backgroundColor: "#222", color: "#fff", padding: 12, borderRadius: 8, marginBottom: 12 }}
      />

      <TouchableOpacity
        style={{ backgroundColor: "#1abc9c", padding: 14, borderRadius: 8 }}
        onPress={handleLogin}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#1abc9c", textAlign: "center" }}>Belum punya akun? Register</Text>
      </TouchableOpacity>
    </View>
  );
}
