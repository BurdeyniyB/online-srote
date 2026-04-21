import { $authHost } from "./index";

export const getDashboardStats = async (period = "30d") => {
  const { data } = await $authHost.get(`/api/dashboard/stats?period=${period}`);
  return data;
};
