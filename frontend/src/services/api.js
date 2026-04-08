import axios from "axios";
import fallbackCars from "../data/fallbackCars";

const API_URL = import.meta.env.VITE_API_URL || "/api";

const client = axios.create({
  baseURL: API_URL,
});

const authHeader = (token) => ({
  headers: {
    Authorization: `Bearer ${token}`,
  },
});

export const getCars = async (params = {}) => {
  try {
    const { data } = await client.get("/cars", { params });
    return data.cars;
  } catch (_error) {
    return fallbackCars;
  }
};

export const getCarById = async (id) => {
  try {
    const { data } = await client.get(`/cars/${id}`);
    return data.car;
  } catch (_error) {
    return fallbackCars.find((car) => car._id === id);
  }
};

export const createCar = async (payload, token) => {
  const { data } = await client.post("/cars", payload, authHeader(token));
  return data.car;
};

export const purchaseCar = async (id, token) => {
  const { data } = await client.post(`/cars/${id}/purchase`, {}, authHeader(token));
  return data;
};

export const placeBid = async (carId, amount, token) => {
  const { data } = await client.post(`/auctions/${carId}/bid`, { amount }, authHeader(token));
  return data.bid;
};

export const getHighestBid = async (carId) => {
  try {
    const { data } = await client.get(`/auctions/${carId}/highest`);
    return data.highestBid;
  } catch (_error) {
    return null;
  }
};

export const loginUser = async (payload) => {
  const { data } = await client.post("/auth/login", payload);
  return { user: data.user, token: data.token };
};

export const registerUser = async (payload) => {
  const { data } = await client.post("/auth/register", payload);
  return { user: data.user, token: data.token };
};

export const getProfile = async (token) => {
  const { data } = await client.get("/auth/me", authHeader(token));
  return data.user;
};

export const getBuyerDashboard = async (token) => {
  const { data } = await client.get("/dashboard/buyer", authHeader(token));
  return data.dashboard;
};

export const getSellerDashboard = async (token) => {
  const { data } = await client.get("/dashboard/seller", authHeader(token));
  return data.dashboard;
};

export const getAdminDashboard = async (token) => {
  const { data } = await client.get("/dashboard/admin", authHeader(token));
  return data.dashboard;
};
