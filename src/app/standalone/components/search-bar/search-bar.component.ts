import { Component } from '@angular/core';
import { SearchResultsComponent } from '../search-results/search-results.component';
import { PlacesService } from 'src/app/maps/services/places.service';

@Component({
  selector: 'search-bar',
  standalone: true,
  imports: [ SearchResultsComponent ],
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {

  private debounceTimer?: ReturnType<typeof setTimeout>;

  constructor(
    private _places: PlacesService,
  ){}

  public get isLoadingPlaces(): boolean { return this._places.loadingPlaces; }

  public onQueryChanged( query: string = '' ): void {
    if(this.debounceTimer) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout(() => {
      this._places.searchPlace(query);
    }, 1000);
  }

}
