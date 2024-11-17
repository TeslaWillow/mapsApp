import { Component } from '@angular/core';
import { LngLat, Map, MapOptions } from 'maplibre-gl';
import { enviroment } from 'src/environments/environment';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent {

  public map: Map;
  public zoom: number = 9;
  public currentLngLat: LngLat = new LngLat(-86.46208035097027, 16.3737513361057);
  public mapOptions: MapOptions = {
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${enviroment.map_libre_key}`,
    center: this.currentLngLat, //lat,lon
    zoom: this.zoom,
  };

  constructor(){}

  public setMap( map: Map ): void {
    this.map = map;
  }

  public zoomChangeByRange( value: number ): void {
    const zoomTo = Number(value);
    if( isNaN(zoomTo) || !this.map ) return;
    this.map.zoomTo(zoomTo);
  }

  public setMapListeners(): void {
    this.zoom = this.map.getZoom();
  }

  public zoomEnd(): void {
    if(this.map?.getZoom() <= 18) return;
    this.map.zoomTo(18);
  }

  public zoomIn(): void {
    this.map?.zoomIn();
  }

  public zoomOut(): void {
    this.map?.zoomOut();
  }

  public mapMove(): void {
    this.currentLngLat = this.map.getCenter();
  }

}
