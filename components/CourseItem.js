// components/CourseItem.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function CourseItem({ course, onPress }) {
  return (
    <TouchableOpacity onPress={() => onPress(course)}>
      <View style={styles.item}>
        <Text style={styles.title}>{course.name}</Text>
        <Text>{course.description}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 5,
  },
});
