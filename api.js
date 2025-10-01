import axios from "axios";

export const BASE_URL = "http://localhost:5000/api";

export const loginUser = async (email, password) => {
  const res = await axios.post(`${BASE_URL}/auth/login`, { email, password });
  return res.data;
};

export const getCourses = async (userId, role, token) => {
  const url = role === "admin" ? `${BASE_URL}/courses` : `${BASE_URL}/enrolled_course?userId=${userId}`;
  const res = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const getCourseDetail = async (courseId, token) => {
  const res = await axios.get(`${BASE_URL}/courses/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
  return res.data;
};

export const enrollCourse = async (courseId, token) => {
  const res = await axios.post(`${BASE_URL}/enrolled_course`, { courseId }, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return res.data;
};
