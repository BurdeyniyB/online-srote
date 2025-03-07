import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [];
    this._brands = [];
    this._devices = [];
    this._sortBy = [
      { id: "price_asc", name: "Low to High" },
      { id: "price_desc", name: "High to Low" },
      { id: "date_asc", name: "Oldest First" },
      { id: "date_desc", name: "Newest First" },
    ];
    this._minPrice = {};
    this._maxPrice = {};
    this._selectedType = [];
    this._selectedBrand = [];
    this._selectedSortBy = { id: "date_desc", name: "Newest First" };
    this._search = "";
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
    if (this._selectedType.some((t) => t.id === type.id)) {
      this._selectedType = this._selectedType.filter((t) => t.id !== type.id);
    } else {
      this._selectedType = [...this._selectedType, type];
    }
    console.log("selected type:" + this._selectedType);
  }

  setSelectedBrand(brand) {
    if (this._selectedBrand.some((b) => b.id === brand.id)) {
      this._selectedBrand = this._selectedBrand.filter((b) => b.id !== brand.id);
    } else {
      this._selectedBrand = [...this._selectedBrand, brand];
    }
    console.log("selected brand:" + this._selectedBrand);
  }

  setSelectedSortBy(sortBy) {
    if (this._selectedSortBy.id !== sortBy.id) {
      this._selectedSortBy = sortBy;
    } else {
      this._selectedSortBy = {};
    }
    console.log("selected sort:" + this._selectedSortBy);
  }

  setMinPrice(minPrice){
    this._minPrice = minPrice;
  }

  setMaxPrice(maxPrice){
    this._maxPrice = maxPrice;
  }

  setSearch(search) {
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

  get sortBy() {
    return this._sortBy;
  }

  get selectedType() {
    return this._selectedType;
  }

  get selectedBrand() {
    return this._selectedBrand;
  }

  get selectedSortBy() {
    return this._selectedSortBy;
  }

  get minPrice(){
    return this._minPrice;
  }

  get maxPrice() {
    return this._maxPrice;
  }

  get search() {
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
