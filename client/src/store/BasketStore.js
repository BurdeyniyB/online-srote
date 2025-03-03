import { makeAutoObservable } from "mobx";

export default class BasketStore {
  constructor() {
    const savedBasket = localStorage.getItem("basketDevices");
    this._basketDevices = savedBasket ? JSON.parse(savedBasket) : [];
    makeAutoObservable(this);
  }

  setBasketDevice(basketDevice) {
    console.log("basket device: " + JSON.stringify(basketDevice));
    if(basketDevice.length < 1) return;
    
    if (!this._basketDevices.some((d) => d.deviceId === basketDevice.deviceId)) {
      console.log("add device");
      this._basketDevices = [...this._basketDevices, basketDevice];
      this.saveToLocalStorage();
    }
    
    console.log("device: " + JSON.stringify(this._basketDevices));
  }

  setQuantity(basketDevice) {
    const deviceItem = this._basketDevices.find((b) => b.deviceId === basketDevice.deviceId);
    if (deviceItem) {
        deviceItem.quantity = basketDevice.quantity;
        this.saveToLocalStorage(); 
    }
}

  removeBasketDevice(deviceId) {
    this._basketDevices = this._basketDevices.filter((item) => item.deviceId !== deviceId);
    this.saveToLocalStorage();
  }

  get basketDevices() {
    console.log("basket Devivce: " + JSON.stringify(this._basketDevices));
    return this._basketDevices;
  }

  saveToLocalStorage() {
    localStorage.setItem("basketDevices", JSON.stringify(this._basketDevices));
  }
}
