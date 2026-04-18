import { $authHost, $host } from "./index";

export const createPaymentIntent = async (amount) => {
  const { data } = await $authHost.post("api/payment/create-intent", { amount });
  return data;
};

export const createPayPalOrder = async (amount) => {
  const { data } = await $host.post("api/payment/paypal-order", { amount });
  return data;
};

export const capturePayPalOrder = async (orderID) => {
  const { data } = await $host.post(`api/payment/paypal-capture/${orderID}`);
  return data;
};

export const stripeRefund = async (paymentIntentId) => {
  const { data } = await $host.post("api/payment/stripe-refund", { paymentIntentId });
  return data;
};

export const paypalRefund = async (captureId) => {
  const { data } = await $host.post(`api/payment/paypal-refund/${captureId}`);
  return data;
};
