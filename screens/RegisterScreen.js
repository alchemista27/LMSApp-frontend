import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function RegisterScreen({ navigation }) {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-center bg-dark px-6">
      <Text className="text-3xl font-bold text-primary mb-8">Register</Text>

      <Text className="text-light mb-2">First Name</Text>
      <TextInput className="bg-gray-700 text-white p-3 rounded mb-4" value={firstname} onChangeText={setFirstname} />
      
      <Text className="text-light mb-2">Last Name</Text>
      <TextInput className="bg-gray-700 text-white p-3 rounded mb-4" value={lastname} onChangeText={setLastname} />

      <Text className="text-light mb-2">Email</Text>
      <TextInput className="bg-gray-700 text-white p-3 rounded mb-4" value={email} onChangeText={setEmail} />

      <Text className="text-light mb-2">Password</Text>
      <TextInput className="bg-gray-700 text-white p-3 rounded mb-4" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity className="bg-primary py-3 rounded mb-4">
        <Text className="text-white text-center font-bold">Register</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text className="text-light text-center">Sudah punya akun? Login</Text>
      </TouchableOpacity>
    </View>
  );
}
