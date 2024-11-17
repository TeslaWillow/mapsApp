import { Component, OnInit } from '@angular/core';
import { MapOptions } from 'maplibre-gl';
import { enviroment } from 'src/environments/environment';

@Component({
  templateUrl: './full-screen-page.component.html',
  styleUrls: ['./full-screen-page.component.css']
})
export class FullScreenPageComponent implements OnInit {

  public mapOptions: MapOptions = {
    container: 'map',
    style: `https://api.maptiler.com/maps/streets/style.json?key=${enviroment.map_libre_key}`,
    center: [-74.5, 40],
    zoom: 9,
  };

  constructor(){}

  ngOnInit(): void {}

}
