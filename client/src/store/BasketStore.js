import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    this._baskets = [
      { id: 1, userId: 1 },
      { id: 2, userId: 2 },
      { id: 3, userId: 4 },
    ];
    this._basketDevices = [
      { id: 1, basketId: 3, deviceId: 24 },
      { id: 2, basketId: 3, deviceId: 25 },
      { id: 3, basketId: 3, deviceId: 27 },
    ];
    makeAutoObservable(this);
  }

  setBasket(baskets) {
    this._baskets = baskets;
  }

  setBasketDevice(basketDevices) {
    this._basketDevices = basketDevices;
  }

  get baskets() {
    return this._baskets;
  }

  get basketDevices() {
    return this._basketDevices;
  }
}
