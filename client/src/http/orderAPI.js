import { $authHost } from "./index";

export const createOrder = async (order) => {
  const { data } = await $authHost.post("api/order", order);
  return data;
};

export const fetchOrders = async (page = 1, limit = 20, filters = {}) => {
  const params = new URLSearchParams({ page, limit });
  Object.entries(filters).forEach(([key, val]) => {
    if (val !== "" && val !== null && val !== undefined) params.append(key, val);
  });
  const { data } = await $authHost.get(`api/order?${params.toString()}`);
  return data;
};

// kept for backward compat
export const fetchOrder = async (page = 1, limit = 10) => {
  const { data } = await $authHost.get(`api/order?page=${page}&limit=${limit}`);
  return data;
};

export const updateOrderStatus = async (orderId, updates) => {
  const { data } = await $authHost.put("api/order", { orderId, ...updates });
  return data;
};

export const updateOrderTracking = async (orderId, tracking_number) => {
  const { data } = await $authHost.patch("api/order/tracking", { orderId, tracking_number });
  return data;
};

export const updateOrderNotes = async (orderId, manager_notes) => {
  const { data } = await $authHost.patch("api/order/notes", { orderId, manager_notes });
  return data;
};

export const removeOrder = async (orderId) => {
  const { data } = await $authHost.delete(`api/order/${orderId}`);
  return data;
};
