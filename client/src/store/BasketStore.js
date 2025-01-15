import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._basketDevices = [];
    makeAutoObservable(this);
  }

  setBasketDevice(basketDevices) {
    this._basketDevices = basketDevices;
  }

  removeBasketDevice(deviceId) {
    this._basketDevices = this._basketDevices.filter((item) => item.deviceId !== deviceId);
  }

  get basketDevices() {
    return this._basketDevices;
  }
}
