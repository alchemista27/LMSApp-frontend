// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/context/AuthContext';
import AppNavigator from './src/navigation/AppNavigator';
// Update App.js to include EnrollmentProvider
import { EnrollmentProvider } from './src/context/EnrollmentContext';
import { ProgressProvider } from './src/context/ProgressContext';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <EnrollmentProvider>
          <ProgressProvider>
            <NavigationContainer>
              <AppNavigator />
            </NavigationContainer>
          </ProgressProvider>
        </EnrollmentProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}