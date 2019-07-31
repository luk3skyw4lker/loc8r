import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  constructor() { }

  public getPosition(cbSuccess, cbError, cbNeoGeo): void {
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(cbSuccess, cbError);
    } else {
      cbNeoGeo();
    }
  }
}
