import axios from 'axios';

export const BASE_URL = 'http://localhost:5000'; // backend-mu

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/auth/login`, { email, password });
    return res.data; // { id, username, role, token }
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const getCourses = async (userId, role) => {
  try {
    if (role === 'admin') {
      const res = await axios.get(`${BASE_URL}/api/courses`);
      return res.data;
    } else {
      const res = await axios.get(`${BASE_URL}/api/enrolled_course?userId=${userId}`);
      return res.data;
    }
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCourseDetail = async (courseId) => {
  try {
    const res = await axios.get(`${BASE_URL}/api/course/${courseId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
