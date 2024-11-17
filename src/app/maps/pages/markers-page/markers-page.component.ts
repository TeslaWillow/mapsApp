import { MarkerOptions } from './../../../../../node_modules/maplibre-gl/dist/maplibre-gl.d';
import { Component } from '@angular/core';
import { LngLat, Map, MapOptions, Marker } from 'maplibre-gl';
import { enviroment } from 'src/environments/environment';

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent {

  public map: Map;
  public zoom: number = 9;
  public currentLngLat: LngLat = new LngLat(-77.008591, 17.947017);
  public mapOptions: MapOptions = {
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${enviroment.map_libre_key}`,
    center: this.currentLngLat, //lat,lon
    zoom: this.zoom,

  };
  public markers: MarkerAndColor[] = [];

  constructor(){}

  public setMap( map: Map ): void {
    this.map = map;
    this.readFromLocalStorage();
  }

  public createMarker(): void {
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  public addMarker( lngLat: LngLat, color: string ): void {
    if(!this.map) return;

    // const markerHTML = document.createElement('div');
    // markerHTML.innerHTML = 'TEST';

    const markerOptions: MarkerOptions = {
      color,
      draggable: true,
      // element: markerHTML,
    };

    const marker = new Marker(markerOptions)
    .setLngLat( lngLat )
    .addTo( this.map );

    this.markers.push({
      color,
      marker
    });


    this.saveToLocalStorage();

    marker.on('dragend', this.saveToLocalStorage );
  }

  public deleteMarker( index: number ): void {
    this.markers[index].marker.remove();
    this.markers.splice( index, 1 );

    this.saveToLocalStorage();
  }

  public flyTo( marker: Marker ): void {
    this.map?.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    });
  }

  public saveToLocalStorage(): void {
    const plainMarkers: PlainMarker[] = this.markers.map(
      ({ color, marker }) => {
        return {
          color,
          lngLat: marker.getLngLat().toArray(),
        }
      }
    );

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarkers));
  }

  public readFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString);

    plainMarkers.forEach( ({color, lngLat}) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);

      this.addMarker( coords, color );
    });

  }

}

interface MarkerAndColor {
  color: string;
  marker: Marker;
}

interface PlainMarker {
  color: string;
  lngLat: number[];
}
