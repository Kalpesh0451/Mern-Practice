import axios from "axios";

const API_URL = "http://localhost:5001/api/instructors";

// Get all instructors
export const getInstructors = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

// Get instructor by ID
export const getInstructorById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Create instructor
export const createInstructor = async (instructorData) => {
  const response = await axios.post(API_URL, instructorData);
  return response.data;
};

// Update instructor
export const updateInstructor = async (id, instructorData) => {
  const response = await axios.put(`${API_URL}/${id}`, instructorData);
  return response.data;
};

// Delete instructor
export const deleteInstructor = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};