import { makeAutoObservable } from "mobx";

export default class OrderStore {
  constructor() {
    this._orderDevices = [];
    makeAutoObservable(this);
  }

  setOrderDevices(orderDevices) {
    this._orderDevices = orderDevices;
  }

  clearOrderDevices(orderId) {
    this._orderDevices = this._orderDevices.filter((item) => item.orderId !== orderId);
  }

  get orderDevices() {
    return this._orderDevices;
  }
}
