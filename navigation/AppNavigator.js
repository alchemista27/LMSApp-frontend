import React, { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { AuthContext } from "../context/AuthContext";

import DashboardScreen from "../screens/DashboardScreen";
import CourseDetailScreen from "../screens/CourseDetailScreen";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EnrolledCoursesScreen from "../screens/EnrolledCoursesScreen";
import CreateCourseScreen from "../screens/CreateCourseScreen";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

function CustomDrawer({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  return (
    <DrawerContentScrollView>
      {user ? (
        <>
          <DrawerItem label="Dashboard" onPress={() => navigation.navigate("Dashboard")} />
          <DrawerItem label="Profile" onPress={() => navigation.navigate("Profile")} />
          <DrawerItem label="Enrolled Courses" onPress={() => navigation.navigate("EnrolledCourses")} />
          {user.role === "admin" && (
            <DrawerItem label="Create Course" onPress={() => navigation.navigate("CreateCourse")} />
          )}
          <DrawerItem label="Logout" onPress={logout} />
        </>
      ) : (
        <>
          <DrawerItem label="Login" onPress={() => navigation.navigate("Login")} />
          <DrawerItem label="Register" onPress={() => navigation.navigate("Register")} />
        </>
      )}
    </DrawerContentScrollView>
  );
}

function DrawerNavigator() {
  return (
    <Drawer.Navigator drawerContent={(props) => <CustomDrawer {...props} />}>
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
      <Drawer.Screen name="EnrolledCourses" component={EnrolledCoursesScreen} />
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
