import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Specials {
    productID: number,
    discount: string,
    oldPrice: number,
    title: string,
    category: string,
    brand: string,
    uri: string,
    price: number,
    description: string,
    features: string,
    usage: string,
    quantity: string,
    barcode: string,
}

@Injectable({providedIn: 'root'})
export class SpecialsService {
    constructor(private http: HttpClient) {}

    getSpecials(category: string): Observable<Specials[]> {
        return this.http.get<Specials[]>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/specials/getSpecials?category=${category}`,
            {
                headers: 
                {
                    'Access-Control-Allow-Origin' : '*'    
                }
            }
        )
    }
}