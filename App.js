// App.js
import React, { useState } from 'react';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import CourseDetailScreen from './screens/CourseDetailScreen';

export default function App() {
  const [user, setUser] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  if (!user) {
    return <LoginScreen onLogin={setUser} />;
  }

  if (selectedCourseId) {
    return <CourseDetailScreen courseId={selectedCourseId} onBack={() => setSelectedCourseId(null)} />;
  }

  return (
    <DashboardScreen
      user={user}
      onLogout={() => setUser(null)}
      onSelectCourse={(course) => setSelectedCourseId(course.id)}
    />
  );
}
