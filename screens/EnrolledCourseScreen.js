import React, { useEffect, useState, useContext } from "react";
import { View, Text, FlatList } from "react-native";
import { getEnrolledCourses } from "../api";
import { AuthContext } from "../context/AuthContext";
import CourseItem from "../components/CourseItem";

export default function EnrolledCourseScreen({ navigation }) {
  const { user } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      if (user) {
        const data = await getEnrolledCourses(user.token);
        setCourses(data || []);
      }
    };
    fetch();
  }, [user]);

  return (
    <View style={{ flex: 1, backgroundColor: '#111', padding: 16 }}>
      <Text style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>Enrolled Courses</Text>
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
