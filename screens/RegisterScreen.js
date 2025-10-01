import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { registerUser } from "../api";

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await registerUser(email, password);
    if (res?.success) {
      Alert.alert("Sukses", "Registrasi berhasil, silakan login");
      navigation.navigate("Login");
    } else {
      Alert.alert("Gagal", res?.message || "Registrasi gagal");
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 16, backgroundColor: "#111" }}>
      <Text style={{ color: "#fff", fontSize: 24, textAlign: "center", marginBottom: 20 }}>Register</Text>

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
        onPress={handleRegister}
      >
        <Text style={{ color: "#fff", textAlign: "center", fontWeight: "bold" }}>Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={{ marginTop: 16 }}>
        <Text style={{ color: "#1abc9c", textAlign: "center" }}>Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
