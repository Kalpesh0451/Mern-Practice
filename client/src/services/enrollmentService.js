
import axios from "axios";

const API_URL = "http://localhost:5001/api/enrollments";

// Get all enrollments
export const getAllEnrollments = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get enrollment by ID
export const getEnrollmentById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create enrollment
export const createEnrollment = async (enrollmentData) => {
  const response = await axios.post(API_URL, enrollmentData);
  return response.data;
};

// Update enrollment
export const updateEnrollment = async (id, enrollmentData) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    enrollmentData
  );
  return response.data;
};

// Delete enrollment
export const deleteEnrollment = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
