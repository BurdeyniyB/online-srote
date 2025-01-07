import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [
      { id: 1, name: "Phone" },
      { id: 2, name: "Headphone" },
    ];
    this._brands = [
      { id: 1, name: "Samsung" },
      { id: 2, name: "Apple" },
    ];
    this._devices = [
      {
        id: 1,
        name: "Iphone 12 pro",
        descriprion: "description iphone 12 pro",
        price: 25000,
        img: "https://cdn.new-brz.net/app/public/models/MGMN3/large/w/201230150020239921.webp",
      },
      {
        id: 2,
        name: "Iphone 12 pro",
        descriprion: "description iphone 12 pro",
        price: 25000,
        img: "https://cdn.new-brz.net/app/public/models/MGMN3/large/w/201230150020239921.webp",
      },
      {
        id: 3,
        name: "Iphone 12 pro",
        descriprion: "description iphone 12 pro",
        price: 25000,
        img: "https://cdn.new-brz.net/app/public/models/MGMN3/large/w/201230150020239921.webp",
      },
      {
        id: 4,
        name: "Iphone 12 pro",
        descriprion: "description iphone 12 pro",
        price: 25000,
        img: "https://cdn.new-brz.net/app/public/models/MGMN3/large/w/201230150020239921.webp",
      },
    ];
    this._selectedType = {}
    this._selectedBrand = {}
    makeAutoObservable(this);
  }

  setTypes(types) {
    this._types = types;
  }

  setBrands(brands) {
    this._brands = brands;
  }

  setDevices(devices) {
    this._devices = devices;
  }

  setSelectedType(type){
    this._selectedType = type;
  }
  
  setSelectedBrand(brand){
    this._selectedBrand = brand;
  }

  get types() {
    return this._types;
  }

  get brands() {
    return this._brands;
  }

  get devices() {
    return this._devices;
  }
  get selectedType(){
    return this._selectedType;
  }

  get selectedBrand(){
    return this._selectedBrand;
  }
}
