import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { CategoryDataService } from './category-data.service';

interface currentCategories {
  category: string;
  subCategory: string;
  uri: string;
  title: string;
}

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})

export class ProductsComponent implements OnInit {

  constructor(private route: ActivatedRoute, private categoryDataService: CategoryDataService) { }

  public isLoading: boolean = false;
  public subCategories: currentCategories[] = [];

  ngOnInit() {
    const InitPromise = new Promise((resolve) => {
      window.scrollTo(0, 0);
      resolve(this.isLoading = true);
    });

    const RoutePromise = new Promise((resolve) => {
      resolve(this.route.params.subscribe((params: Params) => {
        setTimeout(() => {
          this.subCategories = this.categoryDataService.getSubCategories(params.category);
          this.isLoading = false;
        }, 500);
      }));
    });

    async function Init() {
      await InitPromise;
      await RoutePromise;
    }

    try {
      Init();
    } catch (error) {
      throw new Error(error);
    }
  }
}
