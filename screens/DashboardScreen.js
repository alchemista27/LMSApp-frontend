// screens/DashboardScreen.js
import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import CourseItem from "../components/CourseItem";
import { getCourses } from "../api";

export default function DashboardScreen({ navigation }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses();
      setCourses(data);
    };
    fetch();
  }, []);

  return (
    <View className="flex-1 bg-dark p-4">
      <Text className="text-white text-2xl font-bold mb-4">Daftar Course</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseItem
            course={item}
            onPress={() =>
              navigation.navigate("CourseDetail", { courseId: item.id })
            }
          />
        )}
      />
    </View>
  );
}
