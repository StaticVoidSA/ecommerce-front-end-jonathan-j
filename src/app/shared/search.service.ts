import { Injectable, EventEmitter } from '@angular/core';
import { SearchRespData } from './models/SearchRespData.model';
import { Subject, Observable } from 'rxjs';

@Injectable({providedIn: 'root'})
export class SearchService {
  emittedItems = new EventEmitter<SearchRespData[]>();
  emmitedItemsSubject = new Subject<SearchRespData[]>();
  emittedSearchItem = new EventEmitter<string>();
  observableSearchItems = new Observable<SearchRespData[]>();
  observableSearchItem = new Observable<string>();
}
