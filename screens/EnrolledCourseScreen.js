import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import CourseItem from "../components/CourseItem";
import { getCourses } from "../api";
import { AuthContext } from "../context/AuthContext";

export default function EnrolledCourseScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const data = await getCourses(); // backend sebaiknya filter berdasarkan user enrollment
      setCourses(data);
    };
    fetch();
  }, []);

  return (
    <View className="flex-1 bg-dark p-4">
      <Text className="text-white text-2xl font-bold mb-4">Enrolled Courses</Text>
      {courses.length === 0 ? (
        <Text className="text-gray-300">Belum ada course yang diikuti</Text>
      ) : (
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
      )}
    </View>
  );
}
