import { $authHost } from "./index";

export const addToBasket = async (basket) => {
  const { data } = await $authHost.post("api/basket", basket);
  return data;
};

export const setQuantity = async(basket) => {
  const { data } = await $authHost.put("api/basket", basket);
  return data;
};

export const fetchBasket = async (userId) => {
  const { data } = await $authHost.get("api/basket", { params: { userId } });
  return data;
};

export const destroyDeviceFromBasket = async (basket) => {
  const { data } = await $authHost.delete(`api/basket/${basket.userId}/${basket.deviceId}`);
  return data;
};

