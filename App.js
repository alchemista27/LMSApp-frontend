import React from "react";
import { SafeAreaView, StatusBar } from "react-native";
import { AuthProvider } from "./context/AuthContext";
import AppNavigator from "./navigation/AppNavigator";

export default function App() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#2c3e50" }}>
        <StatusBar barStyle="light-content" />
        <AppNavigator />
      </SafeAreaView>
    </AuthProvider>
  );
}
