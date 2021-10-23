import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/models/product.model';
import { NgForm } from '@angular/forms';
import { ProductHelperService } from '../productHelper.service';
import { HomeHelperService } from 'src/app/home/homeHelper.service';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {

  constructor(private route: ActivatedRoute,
    private service: ProductService,
    private productHelper: ProductHelperService,
    private homeHelper: HomeHelperService) { }

  public barcode: string;
  public product: Product;
  public edited: boolean;
  public isLoading: boolean = false;
  public connected: boolean = false;
  @ViewChild('productForm') productForm: NgForm;

  newProduct = {
    productID: null,
    title: null,
    category: null,
    brand: null,
    uri: null,
    price: null,
    description: null,
    features: null,
    usage: null,
    quantity: null,
    barcode: null,
    _barcode: null
  };

  ngOnInit() {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise(resolve => {
      window.scrollTo(0, 0);
      resolve(this.isLoading = true);
    });

    const RoutePromise = new Promise((resolve, reject) => {
      this.route.params.subscribe((params: Params) => {
        this.barcode = params.barcode;
        this.service.getProduct(this.barcode).subscribe(data => {
          this.product = data;
          !data && (reject(data));
        });
      });
      resolve(setTimeout(() => {
        this.isLoading = false;
      }, 500));
    });

    async function Init() {
      await InitPromise;
    }

    async function Afterinit() {
      await RoutePromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init().then(Afterinit);
    } catch (error) {
      throw new Error(error);
    }
  }

  onSubmit() {
    try {
      this.isLoading = true;
      this.productHelper.updateProduct(this.newProduct, this.product, this.productForm, this.barcode);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }
}
