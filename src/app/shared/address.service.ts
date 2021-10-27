import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Address {
    addressID: number;
    id: number;
    userAddress: string;
    addressNickName: string;
    isDefault: string;
}

export enum AddAddressResponse {
    True = 1,
    False = 2,
    Exists = 3
}

@Injectable({providedIn: 'root'})
export class AddressService {
    constructor(private http: HttpClient) {}

    createAddress(address: Address): Observable<AddAddressResponse> {
        return this.http.post<AddAddressResponse>(
            'https://rnr-ecommerce-server-jj.herokuapp.com/api/address/createAddress',
            {
                addressID: address.addressID,
                ID: address.id,
                userAddress: address.userAddress,
                addressNickName: address.addressNickName,
                isDefault: address.isDefault
            },
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role'),
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    getAddresses(userID: number): Observable<Address[]> {
        return this.http.get<Address[]>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/address/getAddresses?userID=${userID}`,
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role'),
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    deleteAddress(userID: number, addressID: number): Observable<boolean> {
        return this.http.delete<boolean>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/address/deleteAddress?addressID=${addressID}&userID=${userID}`,
            {
                headers:
                {
                    'Authorization': sessionStorage.getItem('access_token'),
                    'User': sessionStorage.getItem('user_name'),
                    'Role': sessionStorage.getItem('user_role'),
                    'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }

    updateAddress(address: Address): Observable<boolean> {
        return this.http.put<boolean>(
            `https://rnr-ecommerce-server-jj.herokuapp.com/api/address/updateAddress`,
            {
                ID: address.id,
                addressID: address.addressID,
                userAddress: address.userAddress,
                isDefault: address.isDefault,
                addressNickName: address.addressNickName
            },
            {
                headers:
                {
                  'Authorization': sessionStorage.getItem('access_token'),
                  'User': sessionStorage.getItem('user_name'),
                  'Role': sessionStorage.getItem('user_role'),
                  'Access-Control-Allow-Origin' : '*'
                }
            }
        )
    }
}