import { Component } from '@angular/core';

@Component({
  selector: 'maps-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent {
  public readonly menuItem: MenuItem[] = [
    { route: '/maps/fullscreen', name: 'Full Screen' },
    { route: '/maps/zoom-range', name: 'Zoom Range' },
    { route: '/maps/markers', name: 'Markers' },
    { route: '/maps/properties', name: 'Houses' },
  ];
}

interface MenuItem {
  name: string;
  route: string;
}
