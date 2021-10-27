import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { CompleteTransaction } from "../deliveries/deliveriesHelper.service";

@Injectable({providedIn: 'root'})
export class CompleteCheckoutService {
    constructor(private http: HttpClient) {}

    completeCheckout(transaction: CompleteTransaction): Observable<boolean> {
        return this.http.post<boolean>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/completeTransaction/complete',
            {
                userName: transaction.userName,
                userEmail: transaction.userEmail,
                userID: transaction.userID,
                paidItems: transaction.paidItems,
                selectedAddress: transaction.selectedAddress,
                selectedShop: transaction.selectedShop,
                selectedCollectionDate: transaction.selectedCollectionDate,
                deliveryDate: transaction.deliveryDate,
                transactionDate: transaction.transactionDate,
                userSelection: transaction.userSelection
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
}