import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-track-my-order',
  templateUrl: './track-my-order.component.html',
  styleUrls: ['./track-my-order.component.css']
})
export class TrackMyOrderComponent implements OnInit {

  constructor() { }
  isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

}
