import { Injectable, OnInit } from '@angular/core';
import { Product } from './models/product.model';
import { ProductService } from './product.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class ProductResolverService implements OnInit, Resolve<Product[]> {

  constructor(private service: ProductService) {}
  products: Product[];

  ngOnInit() {
    // this.service.getProducts().subscribe(data => {
    //   this.products = data;
    // });
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Product[]> | Promise<Product[]> | Product[] {
    // const observable: Observable<Product[]> = Observable.create(observer => {
    //   observer.next(this.products);
    //   observer.complete();
    // });

    // return observable;

    // const promise: Promise<Product[]> = new Promise((resolve, reject) => {
    //   this.service.getProducts().subscribe(data => {
    //     this.products = data;
    //   });
    //   resolve(this.products);
    // });

    // return promise;

    this.service.getProducts().subscribe(data => {
      this.products = data;
    });

    return this.products;
  }
}
