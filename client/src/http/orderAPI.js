import { $authHost } from "./index";

export const createOrder = async (order) => {
  const { data } = await $authHost.post("api/order", order);
  return data;
};

export const fetchOrder = async (page = 1, limit = 10) => {
  const { data } = await $authHost.get(`api/order?page=${page}&limit=${limit}`);
  return data;
};

export const removeOrder = async (orderId) => {
  const { data } = await $authHost.delete(`api/order/${orderId}`);
  return data;
};

