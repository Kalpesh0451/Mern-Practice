
import axios from "axios";

const API_URL = "http://localhost:5001/api/reports";

// Fetch dashboard statistics
export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/overview`);
  return response.data;
};

// Fetch student enrollment trend
export const getEnrollmentTrend = async () => {
  const response = await axios.get(`${API_URL}/enrollment-trend`);
  return response.data;
};
