import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-liquor-catalogue',
  templateUrl: './liquor-catalogue.component.html',
  styleUrls: ['./liquor-catalogue.component.css']
})
export class LiquorCatalogueComponent implements OnInit {

  constructor() { }

  public isLoading: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
