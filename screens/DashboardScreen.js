// screens/DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, FlatList, Button, ActivityIndicator } from 'react-native';
import { getCourses } from '../api';
import CourseItem from '../components/CourseItem';

export default function DashboardScreen({ user, onLogout, onSelectCourse }) {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    const data = await getCourses(user.id, user.role);
    setCourses(data);
    setLoading(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 15 }}>
        Welcome, {user.username} ({user.role})
      </Text>
      <Button title="Logout" onPress={onLogout} />
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <CourseItem course={item} onPress={onSelectCourse} />}
          style={{ marginTop: 20 }}
        />
      )}
    </SafeAreaView>
  );
}
