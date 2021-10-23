import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-covid-update',
  templateUrl: './covid-update.component.html',
  styleUrls: ['./covid-update.component.css']
})
export class CovidUpdateComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

  goToURL() : void {
    window.open("https://www.sacoronavirus.co.za", "_blank");
  }
}
