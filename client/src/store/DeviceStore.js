import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [];
    this._brands = [];
    this._devices = [];
    this._selectedType = {};
    this._selectedBrand = {};    
    this._search = '';
    this._page = 1;
    this._totalCount = 0;
    this._limit = 8;
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

  setSelectedType(type) {
    this._selectedType = type;
  }  
  
  setSelectedBrand(brand) {
    this._selectedBrand = brand;
  }  

  setSearch(search){
    this._search = search;
  }

  setlimit(limit) {
    this._limit = limit;
  }

  setPage(page) {
    this._page = page;
  }

  setTotalCount(totalCount) {
    this._totalCount = totalCount;
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

  get selectedType() {
    return this._selectedType;
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  get search(){
    return this._search;
  }

  get limit() {
    return this._limit;
  }

  get page() {
    return this._page;
  }

  get totalCount() {
    return this._totalCount;
  }
}
