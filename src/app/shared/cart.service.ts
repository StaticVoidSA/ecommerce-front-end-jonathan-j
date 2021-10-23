import { Injectable, EventEmitter } from '@angular/core';
import { Product } from './models/product.model';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';

export class CartItem {
  userID: number;
  cartID: number;
  title: string;
  brand: string;
  price: number;
  quantity: number;
  barcode: string;
  productID: string;

  constructor(userID, cartID, title, brand, price, quantity, barcode, productID) {
    this.userID = userID;
    this.cartID = cartID;
    this.title = title;
    this.brand = brand;
    this.price = price;
    this.quantity = quantity;
    this.barcode = barcode;
    this.productID = productID;
  }
}

@Injectable({ providedIn: 'root' })
export class CartService {
  public emittedCartItem = new EventEmitter<Product>();

  cartCount: number = 0;
  private cartItemsCount = new BehaviorSubject(this.cartCount);
  currentitems = this.cartItemsCount.asObservable();

  cartCountUpdate(cart: number) {
    this.cartItemsCount.next(cart);
  }

  constructor(private http: HttpClient) { }

  addToCart(item: CartItem): Observable<boolean> {
    return this.http.post<boolean>(
      'https://localhost:4446/api/cart/addToCart',
      {
        userID: item.userID,
        cartID: item.cartID,
        title: item.title,
        brand: item.brand,
        barcode: item.barcode,
        quantity: item.quantity,
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

  getItems(userID: number): Observable<CartItem[]> {
    return this.http.get<CartItem[]>(
      `https://localhost:4446/api/cart/getItems?userID=${userID}`,
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

  deleteCartItem(cartID: number, cartItemID: number): Observable<boolean> {
    return this.http.delete<boolean>(
      `https://localhost:4446/api/cart/removeFromCart?cartID=${cartID}&cartItemID=${cartItemID}`,
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

  getCartCount(userID: number): Observable<number> {
    return this.http.get<number>(
      `https://localhost:4446/api/cart/cartCount?userID=${userID}`,
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

  updateCartItem(userID: number, cartItemID: number, quantity: number): Observable<boolean> {
    return this.http.put<boolean>(
      'https://localhost:4446/api/cart/updateCartItem',
      {
        userID: userID,
        cartItemID: cartItemID,
        quantity: quantity
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

  clearCart = (userID: number) => {
    return this.http.delete<boolean>(
      `https://localhost:4446/api/cart/clearCartItems?userID=${userID}`,
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
