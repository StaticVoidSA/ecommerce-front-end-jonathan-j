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
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/createShoppingList',
      {
        shoppingListName: list.shoppingListName,
        userID: list.userID
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

  getShoppingLists(userID: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/getShoppingLists?userID=${userID}`,
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

  getUserShoppingList(userID: number): Observable<UserShoppingList[]> {
    return this.http.get<UserShoppingList[]>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/getUserShoppingList?userID=${userID}`,
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

  deleteShoppingList(itemID: number, userID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/deleteShoppingList?itemID=${itemID}&userID=${userID}`,
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

  addToShoppingList(list: ShoppingList): Observable<boolean> {
    return this.http.post<boolean>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/addToShoppingList',
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
          'Role': sessionStorage.getItem('user_role'),
          'Access-Control-Allow-Origin' : '*'
        }
      }
    )
  }

  getListItems(listName: string, userId: number): Observable<ShoppingList[]> {
    return this.http.get<ShoppingList[]>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/getListItems?userID=${userId}&listName=${listName}`,
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

  deleteFromList(listID: number, ID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/deleteFromList?listID=${listID}&ID=${ID}`,
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

  getUserDetails(userID: number): Observable<MyUserDetails> {
    return this.http.get<MyUserDetails>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/getUserDetails?userID=${userID}`,
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

  getListCount(userID: number): Observable<number> {
    return this.http.get<number>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/shoppingLists/getListCount?userID=${userID}`,
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
