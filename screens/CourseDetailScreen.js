// screens/CourseDetailScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button, SafeAreaView, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { getCourseDetail } from '../api';

export default function CourseDetailScreen({ courseId, onBack }) {
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourseDetail();
  }, []);

  const fetchCourseDetail = async () => {
    setLoading(true);
    const data = await getCourseDetail(courseId);
    setCourse(data);
    setLoading(false);
  };

  if (loading) return <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 50 }} />;

  if (!course) return <Text>Course tidak ditemukan!</Text>;

  return (
    <SafeAreaView style={{ flex: 1, padding: 20, backgroundColor: '#f5f5f5' }}>
      <Button title="Back" onPress={onBack} />
      <ScrollView style={{ marginTop: 20 }}>
        <Text style={styles.title}>{course.name}</Text>
        <Text style={styles.description}>{course.description}</Text>
        {course.sections && course.sections.map((s) => (
          <View key={s.id} style={styles.section}>
            <Text style={styles.sectionTitle}>{s.name}</Text>
            {s.materials && s.materials.map((m) => (
              <Text key={m.id}>- {m.title}</Text>
            ))}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  description: { marginBottom: 20 },
  section: { marginBottom: 15 },
  sectionTitle: { fontWeight: 'bold', fontSize: 18 },
});
