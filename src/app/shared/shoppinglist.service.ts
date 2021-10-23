import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ShoppingList {
  userID: number,
  shoppingListName: string,
  title: string,
  brand: string,
  barcode: string,
  quantity: number,
  price: number,
  shoppingListID: number
}

export interface UserShoppingList {
  userID: number,
  shoppingListName: string,
  listID: number
}

export interface MyUserDetails {
  userID: number,
  firstName: string,
  surname: string,
  email: string,
  userRole: string,
  doj: Date
}

@Injectable({ providedIn: 'root' })
export class ShoppingListService {

  constructor(private http: HttpClient) { }

  createShoppingList(list: UserShoppingList): Observable<boolean> {
    return this.http.post<boolean>(
      'https://localhost:4446/api/shoppingLists/createShoppingList',
      {
        shoppingListName: list.shoppingListName,
        userID: list.userID
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

  getShoppingLists(userID: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(
      `https://localhost:4446/api/shoppingLists/getShoppingLists?userID=${userID}`,
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

  getUserShoppingList(userID: number): Observable<UserShoppingList[]> {
    return this.http.get<UserShoppingList[]>(
      `https://localhost:4446/api/shoppingLists/getUserShoppingList?userID=${userID}`,
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

  deleteShoppingList(itemID: number, userID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://localhost:4446/api/shoppingLists/deleteShoppingList?itemID=${itemID}&userID=${userID}`,
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

  addToShoppingList(list: ShoppingList): Observable<boolean> {
    return this.http.post<boolean>(
      'https://localhost:4446/api/shoppingLists/addToShoppingList',
      {
        title: list.title,
        brand: list.brand,
        barcode: list.barcode,
        quantity: list.quantity,
        price: list.price,
        shoppingListName: list.shoppingListName,
        shoppingListID: list.shoppingListID,
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

  getListItems(listName: string, userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(
      `https://localhost:4446/api/shoppingLists/getListItems?userID=${userId}&listName=${listName}`,
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

  deleteFromList(listID: number, ID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://localhost:4446/api/shoppingLists/deleteFromList?listID=${listID}&ID=${ID}`,
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

  getUserDetails(userID: number): Observable<MyUserDetails> {
    return this.http.get<MyUserDetails>(
      `https://localhost:4446/api/shoppingLists/getUserDetails?userID=${userID}`,
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

  getListCount(userID: number): Observable<number> {
    return this.http.get<number>(
      `https://localhost:4446/api/shoppingLists/getListCount?userID=${userID}`,
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
