import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    const savedBasket = localStorage.getItem("basketDevices");
    this._basketDevices = savedBasket ? JSON.parse(savedBasket) : [];
    makeAutoObservable(this);
  }

  setBasketDevice(basketDevice) {
    if (basketDevice.length < 1) return;

    if (
      !this._basketDevices.some((d) => d.deviceId === basketDevice.deviceId)
    ) {
      this._basketDevices = [...this._basketDevices, basketDevice];
      this.saveToLocalStorage();
    }
  }

  setQuantity(basketDevice) {
    console.log("set quantity");
    this._basketDevices = this._basketDevices.map((item) =>
      item.deviceId === basketDevice.deviceId
        ? { ...item, quantity: basketDevice.quantity }
        : item
    );
    this.saveToLocalStorage();
  }

  removeBasketDevice(deviceId) {
    this._basketDevices = this._basketDevices.filter(
      (item) => item.deviceId !== deviceId
    );
    this.saveToLocalStorage();
  }

  get basketDevices() {
    return this._basketDevices;
  }

  saveToLocalStorage() {
    localStorage.setItem("basketDevices", JSON.stringify(this._basketDevices));
  }
}
