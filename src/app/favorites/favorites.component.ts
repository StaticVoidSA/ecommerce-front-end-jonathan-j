import { Component, OnInit } from '@angular/core';
import { FavoritesService, GetFavorites } from '../shared/favorites.service';
import { LoginService } from '../auth/login/login.service';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { Router } from '@angular/router';
import { CartService } from '../shared/cart.service';
import { HomeHelperService } from '../home/homeHelper.service';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {

  public isLoading: boolean = false;
  public isLoggedIn: boolean = false;
  public connected: boolean = false;
  public favorites: GetFavorites[] = [];
  public cartCount: number = 0;
  
  public user: AuthRespData = {
    userId: null,
    userName: null,
    userRole: null,
    token: null,
    expiresIn: null,
    loggedIn: false,
    success: null
  };

  constructor(private favoriteService: FavoritesService,
    private loginService: LoginService,
    private router: Router,
    private cartService: CartService,
    private homeHelper: HomeHelperService,
    private notifyService: NotificationService) { }

  ngOnInit() {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise(() => {
      window.scrollTo(0, 0);
      this.isLoading = true;
    });

    const GetUserPromise = new Promise(() => {
      this.loginService.currentUser.subscribe((user: AuthRespData) => {
        this.user = user;
        this.isLoggedIn = user.loggedIn;
      });
    });

    const GetCartCountPromise = new Promise(() => {
      this.cartService.getCartCount(this.user.userId).subscribe((count: number) => {
        this.cartCount = count;
      });
    });

    const FavoritesPromise = new Promise(() => {
      this.favoriteService.getFavorites(this.user.userId).subscribe((_favorites: GetFavorites[]) => {
        (this.user.userId > 0 && this.user.success)
          && (this.cartService.getCartCount(this.user.userId).subscribe((count: number) => {
            this.cartCount = count;
          }));
        setTimeout(() => {
          if (_favorites) {
            this.favorites.splice(0, this.favorites.length);
            this.favorites.push(..._favorites);
            this.isLoading = false;
            return window.scrollTo(0, 0);
          } else {
            this.router.navigate(['/no-current-favorites']);
            this.isLoading = false;
            return window.scrollTo(0, 0);
          }
        }, 500);
      });
    });

    async function Init() {
      await InitPromise;
    }
    
    async function User() {
      await GetUserPromise;
    }

    async function CartCount() {
      await GetCartCountPromise;
    }

    async function Favorites() {
      await FavoritesPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init()
        .then(User)
        .then(CartCount)
        .then(Favorites)
        .catch(err => { throw new Error(err); });
    } catch (error) {
      throw new Error(error);
    }
  }

  onRemoveFromFavorites(userID: number, favID: number) {
    try {
      if (confirm('Are you sure?')) {
        this.isLoading = true;
        this.favoriteService.removeFromFavorites(userID, favID).subscribe((success: boolean) => {
          if (success) {
            this.notifyService.showSuccess(`Favourite ID: ${favID}`, 'Removed From Favorites')
            this.favorites.splice(0, this.favorites.length);
            this.favoriteService.getFavorites(this.user.userId).subscribe((data: any[]) => {
              if (!data || data.length <= 0) {
                  this.router.navigate(['/no-current-favorites']);
                  this.isLoading = false;
              } else {
                this.favorites.push(...data);
                this.isLoading = false;
              }
            });
          } else {
            this.notifyService.showError(`Favorite ID: ${favID}`, 'Unable to remove from favorites');
            this.isLoading = false;
          }
        });
      } else { return; }
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string,
    quantity: number, price: number, productID: string) {
    try {
      const item = {
        userID: this.user.userId,
        cartID: this.user.userId,
        title: title,
        brand: brand,
        price: price,
        quantity: quantity,
        barcode: barcode,
        productID: productID
      }

      this.cartService.addToCart(item).subscribe((success: boolean) => {
        if (success) {
          this.notifyService.showSuccess(`${title}`, 'Favorite Item Added To Cart');
          this.cartCount++;
          this.cartService.cartCountUpdate(this.cartCount);
        } else {
          this.notifyService.showError(`${title}`, 'Unable To Add Favorite To Cart');
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  onNavProductDetail(barcode: string) {
    this.router.navigate(['/product-detail', barcode]);
  }

  onNavBrand(brand: string) {
    this.router.navigate(['/shop', brand]);
  }
}
