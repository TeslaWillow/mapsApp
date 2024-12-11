import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'my-location-btn',
  templateUrl: './my-location-btn.component.html',
  standalone: true,
  styleUrls: ['./my-location-btn.component.css']
})
export class MyLocationBtnComponent {
  @Output()
  public onClickedBtn = new EventEmitter<void>();

  public clickedBtn(): void { this.onClickedBtn.emit(); }
}
