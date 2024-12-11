import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _supportGeolocation = !!navigator.geolocation;
  public userLocation: [number, number] | undefined;

  constructor() {
    this._setUserLocation();
  }

  public get isUserLocationReady(): boolean {
    return !!this.userLocation;
  }

  private _setUserLocation(): void {
    if(!this._supportGeolocation){
      console.error("NOT SUPPORT TO GEOLOCATION");
      return;
    }
    this._getUserLocation();
  }

  private _getUserLocation(): Promise<[number, number]> {
    return new Promise( (res, rej) => {
      navigator.geolocation.getCurrentPosition(
        ({ coords }) =>  {
          this.userLocation = [ coords.longitude, coords.latitude ];
          res(this.userLocation)
        },
        (err) => {
          console.error("Canot get geolocation");
          rej();
        }
      );
    });
  }
}
