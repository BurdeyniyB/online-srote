import { $authHost, $host } from "./index";

export const createBasket = async (basket) => {
  const { data } = await $authHost.post("api/basket", basket);
  return data;
};

export const fetchBasket = async () => {
  const { data } = await $authHost.get("api/basket", basket);
  return data;
};

export const destroyBasket = async () => {
    const { data } = await $authHost.delete("api/basket", basket);
    return data;
}