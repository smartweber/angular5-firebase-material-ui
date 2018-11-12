import { Injectable } from '@angular/core';

@Injectable()
export class DataService {
  returnValue: string; // for a unit test

  constructor() { }

  setObject(name: string, data: any) {
    localStorage.setItem(name, JSON.stringify(data));
  }

  getObject(name: string) {
    return JSON.parse(localStorage.getItem(name));
  }

  saveString(name: string, value: string) {
    localStorage.setItem(name, value);
  }

  getString(name: string) {
    return localStorage.getItem(name);
  }
}
