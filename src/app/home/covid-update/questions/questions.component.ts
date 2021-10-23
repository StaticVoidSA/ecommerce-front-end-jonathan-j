import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-questions',
  templateUrl: './questions.component.html',
  styleUrls: ['./questions.component.css']
})
export class QuestionsComponent implements OnInit {

  panelOpenState: boolean;

  constructor() {
    this.panelOpenState = false;
  }

  ngOnInit(): void {
    window.scrollTo(0, 0);
  }

}
