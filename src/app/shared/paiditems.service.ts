import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CartItem } from "./cart.service";

export interface PaidItems {
    userID: number,
    title: string,
    brand: string,
    barcode: string,
    quantity: number,
    price: number,
    productID: number
}

@Injectable({ providedIn: 'root' })
export class PaidForItemsService {
    constructor(private http: HttpClient) { }

    getPaidItems = (userID: number) => {
        return this.http.get<PaidItems[]>(
            `https://localhost:4446/api/paidItems/getItems?userID=${userID}`,
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

    addToPaidItems = (item: CartItem) => {
        return this.http.post<boolean>(
            `https://localhost:4446/api/cart/addToPaidItems`,
            {
                userID: item.userID,
                title: item.title,
                brand: item.brand,
                barcode: item.barcode,
                quantity: +item.quantity,
                price: item.price,
                productID: item.productID
            },
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

    clearPaidItems = (userID: number) => {
        return this.http.delete<boolean>(
            `https://localhost:4446/api/paidItems/clearAll?userID=${userID}`,
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