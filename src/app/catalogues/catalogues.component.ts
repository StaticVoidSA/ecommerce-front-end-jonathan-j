import { Component, OnInit } from '@angular/core';
import { HomeHelperService } from '../home/homeHelper.service';

interface category {
  name: string,
  uri: string,
  url: string;
}

@Component({
  selector: 'app-catalogues',
  templateUrl: './catalogues.component.html',
  styleUrls: ['./catalogues.component.css']
})
export class CataloguesComponent implements OnInit {

  public isLoading: boolean = false;
  public connected: boolean = false;

  public categories: category[] = [
    { name: 'Fresh Food', uri: '../../assets/Categories/fresh-food1.jpg', url: 'Fresh_Food' },
    { name: 'Food Cupboard', uri: '../../assets/Categories/baking-ingredients.jpg', url: 'Food_Cupboard' },
    { name: 'Frozen Food', uri: '../../assets/Categories/frozen-food1.jpg', url: 'Frozen_Food' },
    { name: 'Convenience Meals', uri: '../../assets/Categories/convienience-meals.jpg', url: 'Convenience_Meals' },
    { name: 'Beverages', uri: '../../assets/Categories/beverages.jpg', url: 'Beverages' },
    { name: 'Health & Beauty', uri: '../../assets/Categories/health-beauty.jpg', url: 'Health_&_Beauty' },
    { name: 'Baby', uri: '../../assets/Categories/baby.png', url: 'Baby' },
    { name: 'Household Cleaning', uri: '../../assets/Categories/house-cleaning.jpg', url: 'House_Hold_Cleaning' },
    { name: 'Electronics & Office', uri: '../../assets/Categories/office.jpg', url: 'Electronics_&_Office' },
    { name: 'Home & Outdoor', uri: '../../assets/Categories/home-outdoor.jpg', url: 'Home_&_Outdoor' },
    { name: 'Liquor', uri: '../../assets/Categories/liquor.jpeg', url: 'Liquor' },
  ];

  constructor(private homeHelper: HomeHelperService) { }

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
