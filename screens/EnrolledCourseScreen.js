import React, { useContext, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import { AuthContext } from "../context/AuthContext";
import { getCourses } from "../api";
import CourseItem from "../components/CourseItem";

export default function EnrolledCoursesScreen({ navigation }) {
  const { user, token } = useContext(AuthContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    async function fetchEnrolled() {
      const data = await getCourses(user.id, "user", token);
      setCourses(data);
    }
    fetchEnrolled();
  }, []);

  return (
    <ScrollView className="bg-gray-900 p-4">
      {courses.map(course => (
        <CourseItem
          key={course.id}
          course={course}
          onPress={() => navigation.navigate("CourseDetail", { courseId: course.id })}
        />
      ))}
    </ScrollView>
  );
}
