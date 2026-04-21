import { $host, $authHost } from "./index";

export const fetchPromos = async () => {
  const { data } = await $authHost.get("api/promo");
  return data;
};

export const createPromo = async (promo) => {
  const { data } = await $authHost.post("api/promo", promo);
  return data;
};

export const updatePromo = async (id, promo) => {
  const { data } = await $authHost.put(`api/promo/${id}`, promo);
  return data;
};

export const deletePromo = async (id) => {
  const { data } = await $authHost.delete(`api/promo/${id}`);
  return data;
};

export const validatePromo = async (code) => {
  const { data } = await $host.post("api/promo/validate", { code });
  return data;
};
