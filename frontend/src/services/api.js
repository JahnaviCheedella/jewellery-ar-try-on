import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
});

export const getCategories = async () => {
  const { data } = await api.get("/categories");
  return data;
};

export const getJewellery = async (category) => {
  const { data } = await api.get("/jewellery", {
    params: category ? { category } : undefined,
  });
  return data;
};

export const getJewelleryById = async (id) => {
  const { data } = await api.get(`/jewellery/${id}`);
  return data;
};

export const trackEvent = async (payload) => {
  try {
    await api.post("/analytics/events", payload);
  } catch {
    // Analytics must never break the try-on experience.
  }
};
