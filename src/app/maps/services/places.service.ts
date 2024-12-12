import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { StadiaSearchQueryResponce, Feature } from '../interfaces/search-location.interface';
import { LngLat, LngLatBounds, Map, Marker, MarkerOptions } from 'maplibre-gl';
import { PlacesApiClient } from '../api/placesApiClient';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _supportGeolocation: boolean = !!navigator.geolocation;
  private _mapDirections: Map;
  private _foundLocations: Feature[] = [];
  private _markers: Marker[] = [];
  public userLocation: [number, number] | undefined;
  public loadingPlaces: boolean = false;

  constructor(
    private _http: PlacesApiClient,
  ) {
    this._setUserLocation();
  }

  public get isUserLocationReady(): boolean { return !!this.userLocation; }
  public get foundLocations(): Feature[] { return [...this._foundLocations] };
  public get currentUserPos(): LngLat { return new LngLat( this.userLocation[0] , this.userLocation[1]) }

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
      this._clearMarkers();
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
        tap(({ features }) => {
          this._foundLocations = features;
          if(this._foundLocations.length <= 0) {
            this._clearMarkers();
            return;
          }
          this._addMarkers(this._foundLocations);
          this._fitMapBounds();
        }),
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

  private _addMarkers( features: Feature[] ): void {
    if( !this._mapDirections ) return;

    this._clearMarkers();

    for (const feature of features) {
      const [ lng, lat ] = feature.geometry.coordinates;
      const marker = this.createMarker( new LngLat(lng, lat), 'blue' ).addTo(this._mapDirections);
      this._markers.push(marker);
    }
  }

  private _fitMapBounds(): void {
    const bounds = new LngLatBounds();
    this._markers.forEach( m => bounds.extend( m.getLngLat() ) );
    bounds.extend( this.currentUserPos );

    this._mapDirections.fitBounds(bounds, { padding: 200 });
  }

  private _clearMarkers(): void {
    this._markers.forEach( m => m.remove() );
    this._markers = [];
  }

}
