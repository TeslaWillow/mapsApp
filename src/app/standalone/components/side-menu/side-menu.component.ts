import { Component } from '@angular/core';
import { MenuItem } from './menu-item.interface';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'side-menu',
  standalone: true,
  imports: [ CommonModule, RouterModule ],
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuAloneComponent {
  public readonly menuItem: MenuItem[] = [
    { route: '/maps/fullscreen', name: 'Full Screen' },
    { route: '/maps/zoom-range', name: 'Zoom Range' },
    { route: '/maps/markers', name: 'Markers' },
    { route: '/maps/properties', name: 'Houses' },
  ];
}

