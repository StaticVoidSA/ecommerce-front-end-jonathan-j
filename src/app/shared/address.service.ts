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
            'https://localhost:4446/api/address/createAddress',
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
                    'Role': sessionStorage.getItem('user_role')
                }
            }
        )
    }

    getAddresses(userID: number): Observable<Address[]> {
        return this.http.get<Address[]>(
            `https://localhost:4446/api/address/getAddresses?userID=${userID}`,
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

    deleteAddress(userID: number, addressID: number): Observable<boolean> {
        return this.http.delete<boolean>(
            `https://localhost:4446/api/address/deleteAddress?addressID=${addressID}&userID=${userID}`,
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

    updateAddress(address: Address): Observable<boolean> {
        return this.http.put<boolean>(
            `https://localhost:4446/api/address/updateAddress`,
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
                  'Role': sessionStorage.getItem('user_role')
                }
            }
        )
    }
}