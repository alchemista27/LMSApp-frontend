import axios from 'axios';

export const BASE_URL = 'http://localhost:5000/api'; // backend-mu

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    return res.data;
  } catch (err) {
    console.error(err.response?.data || err);
    return null;
  }
};

export const getCourses = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/courses`);
    return res.data;
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const getCourseDetail = async (courseId) => {
  try {
    const res = await axios.get(`${BASE_URL}/courses/${courseId}`);
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};

export const enrollCourse = async (courseId, token) => {
  try {
    const res = await axios.post(`${BASE_URL}/enrolled_course`, { courseId }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  } catch (err) {
    console.error(err);
    return null;
  }
};
