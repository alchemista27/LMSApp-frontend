import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { registerUser } from "../api";

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    const res = await registerUser(firstname, lastname, email, password);
    if (res?.user) {
      alert("Register berhasil, silakan login");
      navigation.navigate("Login");
    } else alert(res?.message || "Register gagal");
  };

  return (
    <View className="flex-1 justify-center p-6 bg-secondary">
      <Text className="text-white text-3xl mb-4">Register</Text>
      <TextInput placeholder="Firstname" value={firstname} onChangeText={setFirstname} className="bg-graycustom p-2 rounded mb-2"/>
      <TextInput placeholder="Lastname" value={lastname} onChangeText={setLastname} className="bg-graycustom p-2 rounded mb-2"/>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} className="bg-graycustom p-2 rounded mb-2"/>
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry className="bg-graycustom p-2 rounded mb-4"/>
      <TouchableOpacity onPress={handleRegister} className="bg-primary p-3 rounded mb-2">
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>
    </View>
  );
}
