import { makeAutoObservable } from "mobx";

export default class OrderStore {
  constructor() {
    this._orderDevices = [];
    this._discountPercent = 0;
    this._appliedPromo = "";
    this._contactInfo = {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      country: "",
      stateProvince: "",
      zipPostalCode: "",
      addressLine: "",
      city: "",
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

  setDiscount(percent, promoCode) {
    this._discountPercent = percent;
    this._appliedPromo = promoCode;
  }

  clearDiscount() {
    this._discountPercent = 0;
    this._appliedPromo = "";
  }

  get orderDevices() {
    return this._orderDevices;
  }

  get contactInfo() {
    return this._contactInfo;
  }

  get discountPercent() {
    return this._discountPercent;
  }

  get appliedPromo() {
    return this._appliedPromo;
  }
}
