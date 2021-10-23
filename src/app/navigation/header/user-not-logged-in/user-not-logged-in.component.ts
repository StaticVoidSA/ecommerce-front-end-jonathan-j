import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-not-logged-in',
  templateUrl: './user-not-logged-in.component.html',
  styleUrls: ['./user-not-logged-in.component.css']
})
export class UserNotLoggedInComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }
}
