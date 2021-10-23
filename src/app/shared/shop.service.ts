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
      'https://localhost:4446/api/shop/startup'
    );
  }

  filterByBrand(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://localhost:4446/api/shop/searchBrand',
      {
        brand: request.brand,
        category: request.category
      }
    );
  }

  filterByPrice(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://localhost:4446/api/shop/searchPrice',
      {
        minRange: request.minRange,
        maxRange: request.maxRange,
        category: request.category,
      }
    );
  }

  filterByQuantity(request: SearchRequestData): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://localhost:4446/api/shop/searchQuantity',
      {
        quantity: request.quantity,
        category: request.category
      }
    )
  }
}
