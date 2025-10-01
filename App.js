// App.js
import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { TailwindProvider } from "nativewind";
import AppNavigator from "./navigation/AppNavigator";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";

export default function App() {
  return (
  <TailwindProvider>
  <SafeAreaProvider>
    <AuthProvider>
      <StatusBar style="light" />
      <AppNavigator />
    </AuthProvider>
  </SafeAreaProvider>
  </TailwindProvider>

  );
}
