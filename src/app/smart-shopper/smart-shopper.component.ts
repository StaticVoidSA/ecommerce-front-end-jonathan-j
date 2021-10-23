import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NguCarouselConfig, NguCarousel } from '@ngu/carousel';
import { HomeHelperService } from '../home/homeHelper.service';

@Component({
  selector: 'app-smart-shopper',
  templateUrl: './smart-shopper.component.html',
  styleUrls: ['./smart-shopper.component.css']
})
export class SmartShopperComponent implements OnInit, AfterViewInit {

  constructor(private cdr: ChangeDetectorRef,
    private homeHelper: HomeHelperService) { }

  public slideNo = 0;
  public withAnim = true;
  public resetAnim = true;
  public isLoading: boolean = false;
  public connected: boolean = false;

  @ViewChild('myCarousel') myCarousel: NguCarousel<boolean>;
  public carouselConfig: NguCarouselConfig = {
    grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0},
    load: 3,
    interval: {timing: 4000, initialDelay: 1000},
    loop: true,
    touch: true,
    velocity: 0.2
  }

  public images: string[] = [
    "assets/Smart_Shopper/smart_shopper_banner-1.jpg",
    "assets/Smart_Shopper/smart_shopper_banner-2.jpg",
    "assets/Smart_Shopper/smart_shopper_banner-3.jpg",
    "assets/Smart_Shopper/smart_shopper_banner-4.jpg",
  ];
  
  carouselItems = this.images;

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

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  reset() {
    this.myCarousel.reset(!this.resetAnim);
  }

  moveTo(slide) {
    this.myCarousel.moveTo(slide, !this.withAnim);
  }
}

