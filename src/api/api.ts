import axios from "axios";
import { getToken } from "../utils/token";

export const api = axios.create({
  baseURL: "https://recommendation-engine-e786.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});