import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { SearchRespData } from './models/SearchRespData.model';
import { Observable } from 'rxjs';
import { SearchService } from './search.service';
import { ProductService } from './product.service';

@Injectable({providedIn: 'root'})
export class SearchResolverService implements Resolve<SearchRespData[]> {

  constructor(private service: SearchService, private productService: ProductService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any[]> | Promise<any[]> | any[] {

    const observable: Observable<any[]> = Observable.create(observer => {
      observer.next(this.service.emittedItems);
      observer.next(this.productService.searchItems);
      observer.complete();
    });

    return observable;
  }
}
