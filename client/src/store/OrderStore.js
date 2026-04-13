import { makeAutoObservable } from "mobx";

export default class OrderStore {
  constructor() {
    this._orderDevices = [];
    this._contactInfo = {
      phone: "",
      email: "",
      country: "",
      stateProvince: "",
      zipPostalCode: "",
    };
    makeAutoObservable(this);
  }

  setOrderDevices(orderDevices) {
    this._orderDevices = orderDevices;
  }

  clearOrderDevices(orderId) {
    this._orderDevices = this._orderDevices.filter((item) => item.orderId !== orderId);
  }

  setContactInfo(info) {
    this._contactInfo = { ...this._contactInfo, ...info };
  }

  get orderDevices() {
    return this._orderDevices;
  }

  get contactInfo() {
    return this._contactInfo;
  }
}
