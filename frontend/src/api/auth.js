// frontend/src/api/auth.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api/token/";

export const login = async (username, password) => {
  const res = await axios.post(API_URL, { username, password });
  localStorage.setItem("access", res.data.access);
  localStorage.setItem("refresh", res.data.refresh);
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("access");
  localStorage.removeItem("refresh");
};

export const getAuthHeader = () => {
  const token = localStorage.getItem("access");
  return { Authorization: `Bearer ${token}` };
};
