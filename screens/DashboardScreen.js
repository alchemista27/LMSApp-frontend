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
    <View style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Daftar Course</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <CourseItem
            course={item}
            onPress={() => navigation.navigate("CourseDetail", { courseId: item.id })}
          />
        )}
      />
    </View>
  );
}
