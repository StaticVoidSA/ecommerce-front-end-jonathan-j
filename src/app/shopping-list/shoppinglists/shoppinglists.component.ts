import { Component, OnInit } from '@angular/core';
import { ShoppingList, ShoppingListService } from 'src/app/shared/shoppinglist.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { LoginService } from 'src/app/auth/login/login.service';
import { CartService, CartItem } from 'src/app/shared/cart.service';
import { HomeHelperService } from 'src/app/home/homeHelper.service';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-shoppinglists',
  templateUrl: './shoppinglists.component.html',
  styleUrls: ['./shoppinglists.component.css']
})
export class ShoppinglistsComponent implements OnInit {

  public isLoading: boolean = false;
  public listName: string;
  public user: AuthRespData;
  public userID: number;
  public items: ShoppingList[] = [];
  public cartCount: number = 0;
  public connected: boolean = false;

  constructor(private shoppinglistService: ShoppingListService,
    private route: ActivatedRoute, 
    private loginService: LoginService,
    private router: Router, 
    private cartService: CartService,
    private homeHelper: HomeHelperService,
    private notifyService: NotificationService) { }

  ngOnInit(): void {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const RoutePromise = new Promise((resolve) => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      resolve(this.route.params.subscribe((data: Params) => {
        this.userID = data['userID'];
        this.listName = data['listname'];
      }));
    });

    const DataPromise = new Promise((resolve) => {
      this.loginService.currentUser.subscribe((data: AuthRespData) => { this.user = data; });
      this.cartService.getCartCount(this.user.userId).subscribe((data: number) => { this.cartCount = data; });
      resolve(this.shoppinglistService.getListItems(this.listName, this.userID).subscribe((data: ShoppingList[]) => {
        if (!data) {
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        } else {
          this.items.splice(0, this.items.length);
          this.items.push(...data);
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        }
      }));
    });

    async function GetRoute() {
      await RoutePromise;
    }

    async function GetData() {
      await DataPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; };
      GetRoute().then(GetData);
    } catch (error) {
      throw new Error(error);
    }
  }

  onDeleteFromList(listID: number, ID: number) {
    try {
      if (confirm('Are you sure?')) {
        this.isLoading = true;
        this.shoppinglistService.deleteFromList(listID, ID).subscribe((data: boolean) => {
          if (data) {
            this.items.splice(0, this.items.length);
            this.shoppinglistService.getListItems(this.listName, this.user.userId).subscribe((data: ShoppingList[]) => {
              this.items.push(...data);
            });
            setTimeout(() => {
              this.notifyService.showInfo(``, `Product Removed From List`);
              alert(`Removed from list successfully`);
              this.isLoading = false;
            }, 500)
          } else {
            setTimeout(() => {
              this.notifyService.showError(``, `Unable To Remove Product From List`);
              this.isLoading = false;
            }, 500)
          }
        });
      } else {
        return this.isLoading = false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string, quantity: number, price: number, productID: string) {
    try {
      const item: CartItem = {
        title: title,
        barcode: barcode,
        brand: brand,
        quantity: quantity,
        price: price,
        productID: productID,
        userID: this.user.userId,
        cartID: this.user.userId
      }
      
      this.cartService.addToCart(item).subscribe((success: boolean) => {
        if (success) {
          this.cartCount++;
          this.cartService.cartCountUpdate(this.cartCount);
          this.notifyService.showInfo(`${item.title}`, `Product Added To Cart`);
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        } else {
          this.notifyService.showError(`${item.title}`, `Unable To Add Product To Cart`);
          this.isLoading = false;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  onNavBarcode(barcode: string) {
    this.router.navigate(['/product-detail', barcode]);
  }
}
