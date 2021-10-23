import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-items-not-found',
  templateUrl: './items-not-found.component.html',
  styleUrls: ['./items-not-found.component.css']
})
export class ItemsNotFoundComponent implements OnInit {

  constructor() { }

  ngOnInit()  {
    window.scrollTo(0, 0);
  }

}
