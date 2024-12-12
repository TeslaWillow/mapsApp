import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { LngLat } from 'maplibre-gl';
import { Feature } from 'src/app/maps/interfaces/search-location.interface';
import { PlacesService } from 'src/app/maps/services/places.service';

@Component({
  selector: 'search-results',
  standalone: true,
  imports: [ CommonModule ],
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.css']
})
export class SearchResultsComponent {

  public currentPlace: string;

  constructor(
    private _places: PlacesService,
  ){}

  public get isLoadingPlaces(): boolean { return this._places.loadingPlaces; }
  public get foundLocations(): Feature[] { return this._places.foundLocations; }

  public flyTo( place: Feature ): void {
    this.currentPlace = place.properties.id;

    const [ lng, lat ] = place.geometry.coordinates;
    this._places.flyTo( new LngLat( lng, lat ) );
  }

}
