import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

export default function HamburgerMenu({ navigation }) {
  const { user, logout } = useContext(AuthContext);

  const handleMenu = (item) => {
    switch (item) {
      case "Login": navigation.navigate("Login"); break;
      case "Register": navigation.navigate("Register"); break;
      case "Profile": navigation.navigate("Profile"); break;
      case "Enrolled Courses": navigation.navigate("EnrolledCourses"); break;
      case "Create Course": navigation.navigate("CreateCourse"); break;
      case "Logout": logout(); navigation.navigate("Home"); break;
    }
  };

  const menuItems = !user
    ? ["Login", "Register"]
    : user.role === "admin"
    ? ["Profile", "Enrolled Courses", "Create Course", "Logout"]
    : ["Profile", "Enrolled Courses", "Logout"];

  return (
    <View className="p-4 bg-grey flex-row justify-between">
      {menuItems.map((item) => (
        <TouchableOpacity key={item} onPress={() => handleMenu(item)}>
          <Text className="text-white mx-2">{item}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
