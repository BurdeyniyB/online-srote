import { makeAutoObservable } from "mobx";

export default class DeviceStore {
  constructor() {
    this._types = [
        {id:1, name: 'Phone'},
        {id:2, name: 'HeadPhone'}
    ]
    this._brands = [
        {id:1, name: 'Samsung'},
        {id:2, name: 'Apple'}
    ]
    this._devices = [
        {id:1, name: 'Iphone 12 pro', descriprion: 'description iphone 12 pro', price: 25000, img: 'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj01MqBgOGKAxXAWpEFHYFHIzsYABAVGgJscg&ae=2&aspm=1&co=1&ase=2&gclid=CjwKCAiAm-67BhBlEiwAEVftNr2IShifLJHCxSW_qNLrIdELUVgeGuz9_tF-1FLw0qztvpJEsBZcCxoCjfsQAvD_BwE&ohost=www.google.com&cid=CAESV-D2EgC0dim019uWxK7AIXns567E_Wwb0JEIQDv-U0qcG6ehuVaete-aI7FJwRn-fvuDwEgUR85SbHtNk_AY9jl4l3WZCohdGA5zDwTarpZgyn6cz_4cbw&sig=AOD64_24gZpQZh71vtZF8J1EEPK0pMDaGA&ctype=5&q=&nis=4&ved=2ahUKEwj0kcWBgOGKAxVIHRAIHesIMOwQwg8oAXoECAkQCw&adurl='},
        {id:2, name: 'Iphone 12 pro', descriprion: 'description iphone 12 pro', price: 25000, img: 'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj01MqBgOGKAxXAWpEFHYFHIzsYABAVGgJscg&ae=2&aspm=1&co=1&ase=2&gclid=CjwKCAiAm-67BhBlEiwAEVftNr2IShifLJHCxSW_qNLrIdELUVgeGuz9_tF-1FLw0qztvpJEsBZcCxoCjfsQAvD_BwE&ohost=www.google.com&cid=CAESV-D2EgC0dim019uWxK7AIXns567E_Wwb0JEIQDv-U0qcG6ehuVaete-aI7FJwRn-fvuDwEgUR85SbHtNk_AY9jl4l3WZCohdGA5zDwTarpZgyn6cz_4cbw&sig=AOD64_24gZpQZh71vtZF8J1EEPK0pMDaGA&ctype=5&q=&nis=4&ved=2ahUKEwj0kcWBgOGKAxVIHRAIHesIMOwQwg8oAXoECAkQCw&adurl='},
        {id:3, name: 'Iphone 12 pro', descriprion: 'description iphone 12 pro', price: 25000, img: 'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj01MqBgOGKAxXAWpEFHYFHIzsYABAVGgJscg&ae=2&aspm=1&co=1&ase=2&gclid=CjwKCAiAm-67BhBlEiwAEVftNr2IShifLJHCxSW_qNLrIdELUVgeGuz9_tF-1FLw0qztvpJEsBZcCxoCjfsQAvD_BwE&ohost=www.google.com&cid=CAESV-D2EgC0dim019uWxK7AIXns567E_Wwb0JEIQDv-U0qcG6ehuVaete-aI7FJwRn-fvuDwEgUR85SbHtNk_AY9jl4l3WZCohdGA5zDwTarpZgyn6cz_4cbw&sig=AOD64_24gZpQZh71vtZF8J1EEPK0pMDaGA&ctype=5&q=&nis=4&ved=2ahUKEwj0kcWBgOGKAxVIHRAIHesIMOwQwg8oAXoECAkQCw&adurl='},
        {id:4, name: 'Iphone 12 pro', descriprion: 'description iphone 12 pro', price: 25000, img: 'https://www.googleadservices.com/pagead/aclk?sa=L&ai=DChcSEwj01MqBgOGKAxXAWpEFHYFHIzsYABAVGgJscg&ae=2&aspm=1&co=1&ase=2&gclid=CjwKCAiAm-67BhBlEiwAEVftNr2IShifLJHCxSW_qNLrIdELUVgeGuz9_tF-1FLw0qztvpJEsBZcCxoCjfsQAvD_BwE&ohost=www.google.com&cid=CAESV-D2EgC0dim019uWxK7AIXns567E_Wwb0JEIQDv-U0qcG6ehuVaete-aI7FJwRn-fvuDwEgUR85SbHtNk_AY9jl4l3WZCohdGA5zDwTarpZgyn6cz_4cbw&sig=AOD64_24gZpQZh71vtZF8J1EEPK0pMDaGA&ctype=5&q=&nis=4&ved=2ahUKEwj0kcWBgOGKAxVIHRAIHesIMOwQwg8oAXoECAkQCw&adurl='}
    ]
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

  get Types() {
    return this._types;
  }

  get Brands() {
    return this._brands;
  }

  get Devices() {
    return this._devices;
  }
}
