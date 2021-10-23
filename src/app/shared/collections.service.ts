import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface CollectionItem {
    userID: number,
    collectionID: number,
    userName: string,
    selectedShop: string,
    selectedCollectionDate: Date,
    transactionDate: Date,
    title: string,
    brand: string,
    quantity: number,
    price: number
}

@Injectable({providedIn: 'root'})
export class CollectionsService {
    constructor(private http: HttpClient) {}

    getAllCollections(userID: number): Observable<CollectionItem[]> {
        return this.http.get<CollectionItem[]>(
            `https://localhost:4446/api/collections/getCollections?userID=${userID}`,
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role')
                }
            }
        )
    }
}