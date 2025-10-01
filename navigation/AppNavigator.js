// navigation/AppNavigator.js
import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { AuthContext } from "../context/AuthContext";

import DashboardScreen from "../screens/DashboardScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EnrolledCourseScreen from "../screens/EnrolledCourseScreen";
import CreateCourseScreen from "../screens/CreateCourseScreen";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawer({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const drawerItemStyle = "py-3 px-4 rounded-lg mb-1"; // Tailwind padding & border
  const drawerTextStyle = "text-white text-base";

  return (
    <ScrollView className="bg-gray-900 flex-1 p-4">
      {user ? (
        <View>
          <Text className="text-tosca-400 text-xl font-bold mb-4">Menu</Text>

          <TouchableOpacity
            className={drawerItemStyle + " bg-gray-800"}
            onPress={() => navigation.navigate("Dashboard")}
          >
            <Text className={drawerTextStyle}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={drawerItemStyle + " bg-gray-800"}
            onPress={() => navigation.navigate("Profile")}
          >
            <Text className={drawerTextStyle}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={drawerItemStyle + " bg-gray-800"}
            onPress={() => navigation.navigate("EnrolledCourses")}
          >
            <Text className={drawerTextStyle}>Enrolled Courses</Text>
          </TouchableOpacity>

          {user.role === "admin" && (
            <TouchableOpacity
              className={drawerItemStyle + " bg-gray-800"}
              onPress={() => navigation.navigate("CreateCourse")}
            >
              <Text className={drawerTextStyle}>Create Course</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            className={drawerItemStyle + " bg-red-600"}
            onPress={logout}
          >
            <Text className={drawerTextStyle}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity
            className={drawerItemStyle + " bg-gray-800"}
            onPress={() => navigation.navigate("Login")}
          >
            <Text className={drawerTextStyle}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={drawerItemStyle + " bg-gray-800"}
            onPress={() => navigation.navigate("Register")}
          >
            <Text className={drawerTextStyle}>Register</Text>
          </TouchableOpacity>
        </View>
      )}
    </ScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{ headerShown: false }}
      drawerContent={(props) => <CustomDrawer {...props} />}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="EnrolledCourses" component={EnrolledCourseScreen} />
      <Drawer.Screen name="CreateCourse" component={CreateCourseScreen} />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Home" component={DrawerNavigator} />
            <Stack.Screen name="CourseDetail" component={CourseDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}