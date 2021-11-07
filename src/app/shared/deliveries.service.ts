import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

export interface DeliveryItem {
    userID: number,
    deliveryID: number,
    userName: string,
    selectedAddress: string,
    delvieryDate: Date,
    title: string,
    brand: string,
    quantity: number,
    price: number,
    transactionDate: Date
}

@Injectable({providedIn: 'root'})
export class DeliveriesService {
    constructor(private http: HttpClient) {}

    getAllDeliveries(userID: number): Observable<DeliveryItem[]> {
        return this.http.get<DeliveryItem[]>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/deliveries/getDeliveries?userID=${userID}`,
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role'),
                    'Access-Control-Allow-Origin' : 'https://rnr-ecommerce-server-jj.herokuapp.com'
                }
            }
        )
    }
}