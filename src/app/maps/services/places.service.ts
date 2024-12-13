import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { StadiaSearchQueryResponce, Feature } from '../interfaces/search-location.interface';
import { LngLat, LngLatBounds, Map, Marker, MarkerOptions } from 'maplibre-gl';
import { PlacesApiClient } from '../api/placesApiClient';

import * as polyline from '@mapbox/polyline';

declare var stadiaMapsApi: any;

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private _supportGeolocation: boolean = !!navigator.geolocation;
  private _mapDirections: Map;
  private _foundLocations: Feature[] = [];
  private _markers: Marker[] = [];
  private _lastLayerId: string;

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

    this._clearPolyLine();

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
            this._clearPolyLine();
            this._clearMarkers();
            return;
          }
          this._addMarkers(this._foundLocations);
          this._fitMapBounds();
        }),
      )
      .subscribe({});
  }

  public createRoute( feature: Feature ): void {
    const [ endLng, endLat ] = feature.geometry.coordinates;
    const [ startLng, startLat ] = this.userLocation;

    this._getRoute(startLat, startLng, endLat, endLng, 'auto')
      .then((res) => { this._createPolyLine(res); } )
      .catch( console.error );
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

  public clearFoundPlaces(): void { this._foundLocations = []; }

  private _clearPolyLine(): void {
    if( !!this._mapDirections.getLayer( this._lastLayerId ) ){
      this._mapDirections.removeLayer(this._lastLayerId);
    }

    if (this._mapDirections.getSource(this._lastLayerId)) {
      this._mapDirections.removeSource(this._lastLayerId);
    }
  }

  private _createPolyLine( response: any ): void {

    this._clearPolyLine();

    // Construct a bounding box in the sw, ne format required by MapLibre. Note the lon, lat order.
    const sw: any = [response.trip.summary.minLon, response.trip.summary.minLat];
    const ne: any = [response.trip.summary.maxLon, response.trip.summary.maxLat];

    // Zoom to the new bounding box to focus on the route,
    // with a 50px padding around the edges. See https://maplibre.org/maplibre-gl-js/docs/API/classes/Map/#fitbounds
    this._mapDirections.fitBounds(new LngLatBounds(sw, ne), {padding: 50});

    // For each leg of the trip...
    response.trip.legs.forEach((leg: any, idx: any) => {
      // Add a layer with the route polyline as an overlay on the map
      this._lastLayerId = "leg-" + idx;  // Unique ID with request ID and leg index
      // Note: Our polylines have 6 digits of precision, not 5
      const geometry = polyline.toGeoJSON(leg.shape, 6);
      this._mapDirections.addLayer({
        "id": this._lastLayerId,
        "type": "line",
        "source": {
          "type": "geojson",
          "data": {
            "type": "Feature",
            "properties": {},
            "geometry": geometry
          }
        },
        "layout": {
          "line-join": "round",
          "line-cap": "round"
        },
        "paint": {
          "line-color": "#0000FF",
          "line-opacity": 0.5,
          "line-width": 5
        }
      });
    });
  }

  private _getRoute(startLat: number, startLon: number, endLat: number, endLon: number, costing: string): Promise<any> {
    return new Promise((res, rej) => {
      const api = new stadiaMapsApi.RoutingApi();

      // Build a request body for the route request
      const req = {
        locations: [
          {
            lat: startLat,
            lon: startLon,
            type: "break"
          },
          {
            lat: endLat,
            lon: endLon,
            type: "break"
          }
        ],
        "costing": costing,
      };

      api.route({routeRequest: req}).then(res).catch(rej);
    });
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
