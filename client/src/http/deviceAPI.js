import { $authHost, $host } from "./index";

export const createBrand = async (brand) => {
  const { data } = await $authHost.post("api/device/brand", brand);
  return data;
};

export const fetchBrands = async () => {
  const { data } = await $host.get("api/device/brand");
  return data;
};

export const createType = async (type) => {
  const { data } = await $authHost.post("api/device/type", type);
  return data;
};

export const fetchTypes = async () => {
  const { data } = await $host.get("api/device/type");
  return data;
};

export const createDevice = async (device) => {
  const { data } = await $authHost.post("api/device", device);
  return data;
};

export const fetchDevices = async (typeId, brandId, page, limit = 5, search) => {
  const { data } = await $host.get("api/device", {params:{
    typeId, brandId, page, limit, search
  }});
  return data;
};

export const fetchOneDevice = async (id) => {
  const { data } = await $host.get("api/device/" + id);
  return data;
};
