import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CartItem } from './cart.service';

export interface Favorites {
  productID: number;
  title: string;
  description: string;
  brand: string;
  quantity: string;
  uri: string;
  price: number;
  userID: number;
  barcode: string;
  favID: number;
}

export interface GetFavorites extends Favorites {
  super(productID: number, title: string, description: string, brand: string, 
    quantity: string, uri: string, price: number, userID: number, barcode: string, favID: number);
  ID: number;
}

@Injectable({ providedIn: 'root' })
export class FavoritesService {

  constructor(private http: HttpClient) { }

  getFavorites(userID: number): Observable<GetFavorites[]> {
    return this.http.get<GetFavorites[]>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/favorites/getFavorites?userID=${userID}`,
      {
        headers:
        {
          'Authorization': sessionStorage.getItem('access_token'),
          'User': sessionStorage.getItem('user_name'),
          'Role': sessionStorage.getItem('user_role')
        }
      }
    );
  }

  addToFavorites(favorite: Favorites): Observable<boolean> {
    return this.http.post<boolean>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/favorites/addToFavorites',
      {
        productID: favorite.productID,
        title: favorite.title,
        description: favorite.description,
        brand: favorite.brand,
        quantity: favorite.quantity,
        uri: favorite.uri,
        price: favorite.price,
        userID: favorite.userID,
        barcode: favorite.barcode,
        favID: favorite.favID
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

  removeFromFavorites(ID: number, favID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://rnr-ecommerce-server-jj.herokuapp.com/api/favorites/removeFromFavorites?ID=${ID}&favID=${favID}`,
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

  addToCart(item: CartItem): Observable<boolean> {
    return this.http.post<boolean>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/favorites/addToCart',
      {
        userID: +item.userID,
        cartID: +item.cartID,
        title: item.title,
        brand: item.brand,
        barcode: item.barcode,
        quantity: item.quantity,
        price: item.price,
        productID: +item.productID
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
