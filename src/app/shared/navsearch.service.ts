import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SearchRespData } from '../shared/models/SearchRespData.model';
import { Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class NavSearchService {

  constructor(private http: HttpClient) {}

  searchItemsNavbar(item: string): Observable<SearchRespData[]> {
    return this.http.post<SearchRespData[]>(
      'https://localhost:4446/api/search/searchall',
      {
        item: item
      }
    );
  }
}
