import { Component, Input, OnInit } from '@angular/core';
import { Map, MapOptions, Marker } from 'maplibre-gl';
import { enviroment } from 'src/environments/environment';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './miniMap.component.html',
  styleUrls: ['./miniMap.component.css']
})
export class MiniMapComponent implements OnInit {

  @Input('lngLat')
  public lngLat?: [number, number];

  public map: Map;
  public mapOptions: MapOptions = {
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${enviroment.map_libre_key}`,
    center: this.lngLat,
    zoom: 15,
    interactive: false,
  };

  constructor() { }

  ngOnInit(): void {
    this.mapOptions.center = this.lngLat;
  }

  public setMap( map: Map ): void {
    this.map = map;
    this._addMarker();
  }

  private _addMarker(): void {
    if(!this.map) return;

    new Marker({
      color: 'red',
    })
    .setLngLat(this.lngLat)
    .addTo(this.map);
  }

}
