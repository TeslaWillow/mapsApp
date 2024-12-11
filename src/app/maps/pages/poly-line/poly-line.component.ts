import { Component } from '@angular/core';
import { LngLat, Map, MapOptions, Marker, MarkerOptions, Popup } from 'maplibre-gl';
import { enviroment } from 'src/environments/environment';
import { PlacesService } from '../../services/places.service';
import { MyLocationBtnComponent } from 'src/app/standalone/components/my-location-btn/my-location-btn.component';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-poly-line',
  imports: [ CommonModule, MyLocationBtnComponent, NgxMapLibreGLModule ],
  standalone: true,
  templateUrl: './poly-line.component.html',
  styleUrls: ['./poly-line.component.css']
})
export default class PolyLineComponent {

  public map: Map;
  public currentLngLat: LngLat = new LngLat(0,0);
  public mapOptions: MapOptions = {
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${enviroment.map_libre_key}`,
    center: this.currentLngLat, //lat,lon
    zoom: 9,
  };
  public currentLocationMarker: Marker;

  constructor(
    private _places: PlacesService,
  ) {}

  public get isUserLocationReady(): boolean { return this._places.isUserLocationReady; }
  public get currentUserPos(): LngLat {
    return new LngLat( this._places.userLocation[0] , this._places.userLocation[1])
  }

  public setMap( map: Map ): void {
    this.map = map;
    this.map.setCenter( this.currentUserPos );
    this.focusOnCurrentLocation();
  }

  public focusOnCurrentLocation(): void {
    if(!this.map) return;

    const popUp = new Popup().setHTML(`
       <h6>Here I'm I</h6>
    `);

    this.currentLocationMarker = this.createMarker(this.currentUserPos)
      .setPopup(popUp)
      .addTo( this.map );
  }

  public createMarker( lngLat: LngLat, color: string = "red" ): Marker {
    if(!this.map) return null;

    const markerOptions: MarkerOptions = {
      color,
      draggable: true,
    };

    return new Marker(markerOptions).setLngLat( lngLat );
  }

  public flyToMyCurrentLocation(): void { this.flyTo( this.currentLocationMarker ); }

  public flyTo( marker: Marker ): void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

}
