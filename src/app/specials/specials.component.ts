import { Component, OnInit } from '@angular/core';
import { Specials } from '../shared/specials.service';
import { LoginService } from '../auth/login/login.service';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { UserShoppingList } from '../shared/shoppinglist.service';
import { MatDialog } from '@angular/material/dialog';
import { ShopHelperService } from '../shop/shopHelper.service';
import { HomeHelperService } from '../home/homeHelper.service';
import { CartHelperService } from '../cart/cartHelper.service';
import { CartItem, CartService } from '../shared/cart.service';

interface DialogData {
  listName: string[]
}

@Component({
  selector: 'app-specials',
  templateUrl: './specials.component.html',
  styleUrls: ['./specials.component.css']
})
export class SpecialsComponent implements OnInit {

  public bakerySpecials: Specials[] = [];
  public fruitSpecials: Specials[] = [];
  public juiceSpecials: Specials[] = [];
  public mealsSpecials: Specials[] = [];
  public petsSpecials: Specials[] = [];
  public sportsSpecials: Specials[] = [];
  public isLoading: boolean = false;
  public cartCount: number = 0;
  public userShoppingLists: UserShoppingList[] = [];
  public listNames: DialogData[] = [];
  public chosenList: DialogData;
  public user: AuthRespData;
  public connected: boolean = false;

  private items = [
    { title: 'Bakery', arr: this.bakerySpecials },
    { title: 'Fruit', arr: this.fruitSpecials },
    { title: 'Juice', arr: this.juiceSpecials },
    { title: 'Meals', arr: this.mealsSpecials },
    { title: 'Pets', arr: this.petsSpecials },
    { title: 'Sports', arr: this.sportsSpecials }
  ];

  constructor(private userService: LoginService,
    public dialog: MatDialog,
    private shopHelper: ShopHelperService,
    private homeHelper: HomeHelperService,
    private cartHelper: CartHelperService,
    private cartService: CartService) { }

  ngOnInit(): void {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const UserPromise = new Promise(() => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.userService.currentUser.subscribe((user: AuthRespData) => {
        user ? this.user = user : this.user = null;
      });
    });

    const CartCountPromise = new Promise(() => {
      this.cartService.getCartCount(this.user.userId).subscribe((count: number) => { 
        count > 0 ? this.cartCount = count : this.cartCount = 0; 
      });
    });

    const SpecialsPromise = new Promise(() => {
      this.items.forEach(item => {
        this.homeHelper.getSpecialsDetails(item.title)
          .then((specials: Specials[]) => {
            item.arr.splice(0, item.arr.length);
            item.arr.push(...specials);
          }).catch(error => { throw new Error(error); });
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });

    async function getCartCount() {
      await CartCountPromise;
    }

    async function getSpecials() {
      await SpecialsPromise;
    }

    async function Init() {
      await UserPromise
        .then(getSpecials)
        .then(getCartCount)
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init().catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string,
    quantity: number, price: number, productID: string) {
    try {
      const item: CartItem = {
        userID: +this.user.userId,
        cartID: +this.user.userId,
        title: title, 
        brand: brand,
        price: price,
        quantity: quantity,
        barcode: barcode,
        productID: productID
      }
      this.cartService.addToCart(item).subscribe((success: boolean) => {
        if (success) {
          this.cartCount++;
          this.cartService.cartCountUpdate(this.cartCount);
        } else {
          alert(`Unable to add item ${title} to cart`);
        }
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToFavorites(productID: number, title: string, description: string,
    brand: string, quantity: string, uri: string, price: number, barcode: string) {
    try {
      this.shopHelper.addToFavorites(productID, title, description, brand, quantity, uri, price,
        barcode);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToShoppingList(productTitle: string, brand: string, barcode: string,
    quantity: number, price: number) {
    try {
      this.shopHelper.addToShoppingList(productTitle, brand, barcode, quantity, price);
    } catch (error) {
      throw new Error(error);
    }
  }
}
