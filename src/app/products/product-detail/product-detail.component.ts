import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ProductService } from 'src/app/shared/product.service';
import { Product } from 'src/app/shared/models/product.model';
import { CartService } from 'src/app/shared/cart.service';
import { LoginService } from 'src/app/auth/login/login.service';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { MatDialog } from '@angular/material/dialog';
import { ShoppingList } from 'src/app/shared/shoppinglist.service';
import { ShopHelperService } from 'src/app/shop/shopHelper.service';
import { CartHelperService } from 'src/app/cart/cartHelper.service';
import { HomeHelperService } from 'src/app/home/homeHelper.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {

  public barcode: string;
  public isLoading: boolean = false;
  public product: Product;
  public user: AuthRespData;
  public cartCount: number;
  public loggedIn: boolean = false;
  public lists: ShoppingList[] = [];
  public connected: boolean = false;

  constructor(private route: ActivatedRoute,
    private service: ProductService,
    private cartService: CartService,
    private userService: LoginService,
    public dialog: MatDialog,
    private shopHelper: ShopHelperService,
    private cartHelper: CartHelperService,
    private homeHelper: HomeHelperService) { }

  ngOnInit() {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise((resolve) => {
      window.scrollTo(0, 0);
      resolve(this.userService.currentUser.subscribe(data => { this.user = data; }));
    });

    const RoutePromise = new Promise((resolve) => {
      resolve(this.route.params.subscribe((params: Params) => {
        this.isLoading = true;
        setTimeout(() => {
          this.barcode = params.barcode;
          this.service.getProduct(this.barcode).subscribe((data: Product) => {
            this.product = data;
            window.scrollTo(0, 0);
            this.isLoading = false;
          });
        }, 500);
      }));
    });

    const CartPromise = new Promise((resolve) => {
      resolve(this.cartService.currentitems.subscribe((data: number) => { this.cartCount = data; }));
    });

    async function Init() {
      await InitPromise;
    }

    async function AfterInit() {
      await RoutePromise;
      await CartPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init().then(AfterInit);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string, quantity: number,
    price: number, productID: string) {
    try {
      this.isLoading = true;
      this.cartHelper.addToCart(title, barcode, brand, quantity, price, productID, this.cartCount);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToFavorites(productID: string, title: string, description: string,
    brand: string, quantity: string, uri: string, price: number, barcode: string) {
      try {
        this.isLoading = true;
        this.shopHelper.addToFavorites(+productID, title, description, brand, quantity, uri, price,
          barcode);
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
      } catch (error) {
        throw new Error(error);
      }
  }

  onAddToList(productTitle: string, brand: string, barcode: string, quantity: number, price: number) {
    try {
      this.shopHelper.addToShoppingList(productTitle, brand, barcode, quantity, price);
    } catch (error) {
      throw new Error(error);
    }
  }
}
