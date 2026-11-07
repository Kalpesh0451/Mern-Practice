
import axios from "axios";

const API_URL = "http://localhost:5001/api/courses";

// Get all courses
export const getCourses = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get course by ID
export const getCourseById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create course
export const createCourse = async (courseData) => {
  const response = await axios.post(API_URL, courseData);
  return response.data;
};

// Update course
export const updateCourse = async (id, courseData) => {
  const response = await axios.put(`${API_URL}/${id}`, courseData);
  return response.data;
};

// Delete course
export const deleteCourse = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
