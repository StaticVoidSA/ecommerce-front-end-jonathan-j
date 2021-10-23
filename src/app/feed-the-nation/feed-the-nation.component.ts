import { Component, OnInit } from '@angular/core';
import { HomeHelperService } from '../home/homeHelper.service';

@Component({
  selector: 'app-feed-the-nation',
  templateUrl: './feed-the-nation.component.html',
  styleUrls: ['./feed-the-nation.component.css']
})
export class FeedTheNationComponent implements OnInit {

  constructor(private homeHelper: HomeHelperService) { }

  public isLoading: boolean = false;
  public connected: boolean = false;

  ngOnInit(): void {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    this.connected = this.homeHelper.checkConnection();
    if (!this.connected) { return; }
    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }
}
