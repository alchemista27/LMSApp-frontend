import React, { useContext } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
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

  const itemStyle = {
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 4,
    backgroundColor: '#333',
    borderRadius: 8
  };

  const textStyle = { color: '#fff' };

  return (
    <ScrollView style={{ flex: 1, padding: 16, backgroundColor: '#111' }}>
      {user ? (
        <View>
          <Text style={{ color: '#1abc9c', fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>Menu</Text>

          <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("Dashboard")}>
            <Text style={textStyle}>Dashboard</Text>
          </TouchableOpacity>

          <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("Profile")}>
            <Text style={textStyle}>Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("EnrolledCourses")}>
            <Text style={textStyle}>Enrolled Courses</Text>
          </TouchableOpacity>

          {user.role === "admin" && (
            <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("CreateCourse")}>
              <Text style={textStyle}>Create Course</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity style={{ ...itemStyle, backgroundColor: 'red' }} onPress={logout}>
            <Text style={textStyle}>Logout</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View>
          <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("Login")}>
            <Text style={textStyle}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={itemStyle} onPress={() => navigation.navigate("Register")}>
            <Text style={textStyle}>Register</Text>
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
