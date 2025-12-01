// api.js
import axios from "axios";

// ganti dengan IP laptop kamu
export const API_URL = "http://10.111.34.60:3000"; 

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});
