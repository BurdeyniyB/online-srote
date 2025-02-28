import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._basketDevices = [];
    makeAutoObservable(this);
  }

  setBasketDevice(basketDevice) {
    if(this._basketDevices.some((d) => d.id !== basketDevice.id)){
      this._basketDevices = [...this._basketDevices, basketDevice];
    }
  }

  removeBasketDevice(deviceId) {
    this._basketDevices = this._basketDevices.filter((item) => item.deviceId !== deviceId);
  }

  get basketDevices() {
    return this._basketDevices;
  }
}
