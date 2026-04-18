import { $authHost } from "./index";

export const fetchAddresses = async () => {
  const { data } = await $authHost.get("api/address");
  return data;
};

export const createAddress = async (address) => {
  const { data } = await $authHost.post("api/address", address);
  return data;
};

export const updateAddress = async (id, address) => {
  const { data } = await $authHost.put(`api/address/${id}`, address);
  return data;
};

export const deleteAddress = async (id) => {
  const { data } = await $authHost.delete(`api/address/${id}`);
  return data;
};
