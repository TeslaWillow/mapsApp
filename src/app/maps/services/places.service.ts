import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { StadiaSearchQueryResponce, Feature } from '../interfaces/search-location.interface';
import { LngLat, Map, Marker, MarkerOptions } from 'maplibre-gl';
import { PlacesApiClient } from '../api/placesApiClient';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _supportGeolocation = !!navigator.geolocation;
  private _stadiaMapsUrl: string = "https://api.stadiamaps.com/geocoding/v1";
  private _mapDirections: Map;
  private _foundLocations: Feature[] = [];
  public userLocation: [number, number] | undefined;
  public loadingPlaces: boolean = false;

  constructor(
    private _http: PlacesApiClient,
  ) {
    this._setUserLocation();
  }

  public get isUserLocationReady(): boolean { return !!this.userLocation; }
  public get foundLocations(): Feature[] { return [...this._foundLocations] };

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

  public setMapDirectionsObject( map: Map ): void {
    this._mapDirections = map;
  }

  public searchPlace( query: string ): void {
    if( !this.isUserLocationReady ) return;

    if(!query) {
      this._foundLocations = [];
      this.loadingPlaces = false;
      return;
    }

    const boundaryRadius: number = 50;
    this.loadingPlaces = true;
    this._http.get<StadiaSearchQueryResponce>(`/search`, {
      params: {
        "text": query,
        "boundary.circle.lat":    this.userLocation[1],
        "boundary.circle.lon":    this.userLocation[0],
        "boundary.circle.radius": boundaryRadius
      }
    })
      .pipe(
        tap(() => this.loadingPlaces = false ),
        tap(({ features }) => this._foundLocations = features ),
      )
      .subscribe({});
  }

  public flyTo( coords: LngLat ): void {
    if( !this._mapDirections ) return;

    this._mapDirections.flyTo({
      zoom: 14,
      center: coords,
    });
  }

  public createMarker( lngLat: LngLat, color: string = "red" ): Marker {
    const markerOptions: MarkerOptions = {
      color,
      draggable: false,
    };

    return new Marker(markerOptions).setLngLat( lngLat );
  }

}
