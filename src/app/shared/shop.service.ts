import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SearchRespData } from './models/SearchRespData.model';
import { SearchRequestData } from './models/SearchReqData.model';

@Injectable({providedIn: 'root'})
export class ShopService {
  constructor(private http: HttpClient) {}

  onShopInit(): Observable<SearchRespData[]> {
    return this.http.get<SearchRespData[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shop/startup',
      {
        headers: {
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }

  filterByBrand(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shop/searchBrand',
      {
        brand: request.brand,
        category: request.category
      },
      {
        headers: {
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }

  filterByPrice(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shop/searchPrice',
      {
        minRange: request.minRange,
        maxRange: request.maxRange,
        category: request.category,
      },
      {
        headers: {
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }

  filterByQuantity(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shop/searchQuantity',
      {
        quantity: request.quantity,
        category: request.category
      },
      {
        headers: {
          'Access-Control-Allow-Origin' : '*'
        }
      }
    )
  }
}
