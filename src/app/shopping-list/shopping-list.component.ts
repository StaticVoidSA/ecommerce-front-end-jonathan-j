import { Component, OnInit, ViewChild } from '@angular/core';
import { ShoppingListService, ShoppingList, UserShoppingList, MyUserDetails } from '../shared/shoppinglist.service';
import { LoginService } from '../auth/login/login.service';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { NgForm } from '@angular/forms';
import { CartItem, CartService } from '../shared/cart.service';
import { GetFavorites, FavoritesService } from '../shared/favorites.service';
import { Router } from '@angular/router';
import { CartHelperService } from '../cart/cartHelper.service';
import { ShoppingListHelper } from './shoppinListHelper.service';
import { HomeHelperService } from '../home/homeHelper.service';

export interface List {
  userID: number,
  listName: string
}

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {
  public user: AuthRespData = null;
  public userDetails: MyUserDetails;
  public shoppingListItems: ShoppingList[] = [];
  public shoppingLists: UserShoppingList[] = [];
  public isLoading: boolean = false;
  public cartItems: CartItem[] = [];
  public favorites: GetFavorites[] = [];
  public totalPrice: number = 0.00;
  public finalPrice: number = 0;
  public totalItems: number = 0;
  public cartCount: number = 0;
  public userEmail: string = "";
  @ViewChild('userForm') userForm: NgForm;
  public isLoggedIn: boolean = false;
  public connected: boolean = false;

  private updatedUser = {
    firstName: null,
    surname: null,
    email: null,
    _email: null,
    doj: null,
    userRole: null
  };

  constructor(private loginService: LoginService,
    private shoppinglistService: ShoppingListService,
    private favoritesService: FavoritesService,
    private cartService: CartService,
    private router: Router,
    private cartHelper: CartHelperService,
    private shoppingListHelper: ShoppingListHelper,
    private homeHelper: HomeHelperService) { }

  ngOnInit(): void {
    const ConnectionPromise = new Promise(() => {
      window.addEventListener('online', () => { this.connected = true; });
      window.addEventListener('offline', () => { this.connected = false; });
    });

    const InitPromise = new Promise(() => {
      this.isLoading = true;
      this.loginService.currentUser.subscribe((user: AuthRespData) => {
        this.user = user;
      });
      setTimeout(() => {
        this.shoppinglistService.getUserShoppingList(this.user.userId).subscribe((lists: UserShoppingList[]) => {
          this.shoppingLists.splice(0, this.shoppingLists.length);
          this.shoppingLists.push(...lists);
        });
        this.isLoading = false;
      }, 1500);
    });

    const FavoritesPromise = new Promise(() => {
      this.favoritesService.getFavorites(this.user.userId).subscribe((favorites: GetFavorites[]) => {
        this.favorites.splice(0, this.favorites.length);
        this.favorites.push(...favorites);
      });
    });

    const CartPromise = new Promise(() => {
      this.cartService.getItems(this.user.userId).subscribe((items: CartItem[]) => {
        this.cartItems.splice(0, this.cartItems.length);
        this.cartItems.push(...items);
        this.totalItems = this.cartHelper.getCartCount(this.cartItems);
        this.cartCount = this.cartHelper.getCartCount(this.cartItems);
        this.totalPrice = this.cartHelper.calculateTotalPrice(this.cartItems);
      });
    });

    const UserDetailsPromise = new Promise(() => {
      this.shoppinglistService.getUserDetails(this.user.userId).subscribe(details => {
        this.userDetails = details;
        this.userEmail = this.userDetails.email
      });
    });

    async function Init() {
      await ConnectionPromise;
      await InitPromise;
    }

    async function AfterInit() {
      await FavoritesPromise;
      await CartPromise;
      await UserDetailsPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; };
      Init()
        .then(AfterInit)
        .catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  onCreateList(form: NgForm) {
    try {
      this.isLoading = true;
      this.shoppingListHelper.createShoppingList(this.user.userId, form, this.shoppingLists);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onDeleteList(itemID: number, userID: number) {
    try {
      this.isLoading = true;
      this.shoppingListHelper.deleteList(itemID, userID, this.shoppingLists);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string, quantity: number, price: number, productID: string) {
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

  onRemoveFromFavorites(ID: number, favID: number) {
    try {
      if (confirm(`Are you sure?`)) {
        this.isLoading = true;
        this.favoritesService.removeFromFavorites(ID, favID).subscribe((success: boolean) => {
            if (success) {
                alert(`Successfully removed from favorites`);
                setTimeout(() => {
                  this.favorites.splice(0, this.favorites.length);
                  this.favoritesService.getFavorites(this.user.userId).subscribe((favorites: GetFavorites[]) => {
                    if (favorites.length <= 0) {
                      this.isLoading = false;;
                    } else {
                      this.favorites.push(...favorites);
                      this.isLoading = false;
                    }
                  });
                }, 500);
            } else {
                alert(`Unable to remove from favorites`);
                setTimeout(() => {
                  this.isLoading = false;
                }, 500);
            }
        });
      } else {
          return;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  removeProduct(cartID: number, cartItemID: number) {
    try {
      new Promise(() => {
        if (confirm('Are you sure?')) {
          this.isLoading = true;
          this.cartService.deleteCartItem(cartID, cartItemID).subscribe(result => {
            if (result === true) {
              alert(`Product successfully removed from cart`);
              new Promise((resolve) => {
                this.cartItems.splice(0, this.cartItems.length);
                this.cartService.getItems(this.user.userId).subscribe(data => {
                  this.cartItems = data;
                  if (this.cartItems.length > 0) {
                    this.totalPrice = this.cartHelper.calculateTotalPrice(this.cartItems);
                    this.totalItems = this.cartHelper.getCartCount(this.cartItems);
                  } else {
                    this.isLoading = false;
                    this.router.navigate(["/no-cart-items"]);
                  }
                });
                resolve(this.cartService.getCartCount(this.user.userId).subscribe((data: number) => {
                  this.cartService.cartCountUpdate(data);
                  setTimeout(() => {
                    this.isLoading = false;
                  }, 500);
                }));
              });
            } else {
              alert(`Unable to remove item from cart`);
              return this.isLoading = false;
            }
          });
        } else {
          return;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  updateProduct(cartID: number, cartItemID: number, quantity: number) {
    try {
      new Promise(() => {
        if (confirm('Are you sure?')) {
          this.isLoading = true;
          this.cartService.updateCartItem(cartID, cartItemID, quantity).subscribe(result => {
            if (result) {
              alert(`Product successfully updated`);
              new Promise(resolve => {
                this.cartItems.splice(0, this.cartItems.length);
                this.cartService.getItems(this.user.userId).subscribe(data => {
                  this.cartItems = data;
                  this.totalPrice = this.cartHelper.calculateTotalPrice(this.cartItems);
                  this.totalItems = this.cartHelper.getCartCount(this.cartItems);
                });
                resolve(this.cartService.getCartCount(this.user.userId).subscribe((count: number) => {
                  setTimeout(() => {
                    !count && (count = 0);
                    this.cartService.cartCountUpdate(count);
                    this.isLoading = false;
                  }, 100);
                }));
              });
            } else {
              alert(`Unable to update product`);
              this.isLoading = false;
            }
          });
        } else {
          return;
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  onUpdateUser() {
    try {
      this.isLoading = true;
      this.shoppingListHelper.updateUser(this.updatedUser, this.userDetails, this.userForm);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onNavProductDetail(barcode: string) {
    return this.router.navigate(['/product-detail', barcode]);
  }

  onNavBrand(brand: string) {
    return this.router.navigate(['/shop', brand]);
  }
}
