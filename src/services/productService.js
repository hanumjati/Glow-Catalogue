// src/services/productService.js
import { api } from "../api";

export const getCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data?.data || [];
};

export const getNewProducts = async (limit = 10) => {
  const res = await api.get("/api/products/new", { params: { limit } });
  return res.data?.data || [];
};

export const getBestProducts = async (limit = 10) => {
  const res = await api.get("/api/products/best", { params: { limit } });
  return res.data?.data || [];
};

export const getRecommendedProducts = async (limit = 10) => {
  const res = await api.get("/api/products/recommended", { params: { limit } });
  return res.data?.data || [];
};

export const searchProducts = async (q, limit = 50) => {
  if (!q || !q.trim()) return [];
  const res = await api.get("/api/products/search", { params: { q, limit } });
  return res.data?.data || [];
};

export const getProductDetail = async (id) => {
  const res = await api.get(`/api/products/${id}`);
  return res.data?.data || null;
};

// reviews
export const getReviews = async (product_id) => {
  const res = await api.get("/api/reviews", { params: { product_id } });
  return res.data?.data || [];
};

export const submitReview = async ({ product_id, rating, review }) => {
  const res = await api.post("/api/reviews", { product_id, rating, review });
  return res.data?.data || null;
};
