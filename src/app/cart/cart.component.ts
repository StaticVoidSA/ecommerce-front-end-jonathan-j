import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { CartService, CartItem } from '../shared/cart.service';
import { LoginService } from '../auth/login/login.service';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { Router } from '@angular/router';
import { IPayPalConfig } from 'ngx-paypal';
import { CartHelperService } from './cartHelper.service';
import { HomeHelperService } from '../home/homeHelper.service';
import { NotificationService } from '../notification.service';

// Card Type: Visa
// Card Number: 4032038806854307
// Expiration: 08/2026
// CVV: 990

declare var paypal;

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})

export class CartComponent implements OnInit {

  public isLoading: boolean = false;
  public order_id: number = 0;
  public items: CartItem[] = [];
  public paidItems: CartItem[] = [];
  public item: CartItem;
  public user: AuthRespData;
  public totalPrice: number = 0.00;
  public finalPrice: number;
  public totalItems: number = 0;
  public description: string = "";
  @ViewChild('paypal', { static: true }) paypalElement: ElementRef;
  public payPalConfig?: IPayPalConfig;
  public userToken: string = "";
  public clientID;
  public connected: boolean = false;

  constructor(private service: CartService,
    private loginService: LoginService,
    private router: Router,
    private cartHelper: CartHelperService,
    private homeHelper: HomeHelperService,
    private zone: NgZone,
    private notifyService: NotificationService) {}

  ngOnInit(): void {
    const InitPromise = new Promise(() => {
      window.addEventListener('online', () => { this.connected = true; });
      window.addEventListener('offline', () => { this.connected = false; });
  
      window.scrollTo(0, 0);
      this.isLoading = true;
    });

    const UserPromise = new Promise((resolve, reject) => {
      this.loginService.currentUser.subscribe((user: AuthRespData) => {
        if (user) {
          resolve(this.user = user);
        } else {
          reject('No User Present');
        }
      });
    });

    const ItemsPromise = new Promise(() => {
      this.description = `User ${this.user.userName} Cart`;
      this.items.splice(0, this.items.length);
      this.service.getItems(this.user.userId).subscribe((items: CartItem[]) => {
        this.items.push(...items);
      });
    });

    const PricePromise = new Promise(() => {
      setTimeout(() => {
        if (this.items.length > 0) {
          setTimeout(() => {
            this.totalPrice = +this.cartHelper.calculateTotalPrice(this.items).toFixed(2);
            this.totalItems = this.cartHelper.getCartCount(this.items);
            this.isLoading = false;
          }, 100);
        } else {
          setTimeout(() => {
            this.router.navigate(["/no-cart-items"]);
            this.isLoading = false;
          }, 100);
        }
      }, 3500);
    });

    async function Init() {
      await InitPromise;
    }

    async function GetUser() {
      await UserPromise;
    }

    async function GetItems() {
      await ItemsPromise;
    }

    async function GetPrices() {
      await PricePromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init()
        .then(GetUser)
        .then(GetItems)
        .then(GetPrices)
        .catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }

    paypal
      .Buttons({
        createOrder: (data, actions) => {
          return actions.order.create({
            purchase_units: [{
              description: "Rick and Ray Online Shopping",
              order_id: this.order_id++,
              amount: {
                currency_code: 'USD',
                value: this.totalPrice.toFixed(2),
                breakdown: {
                  item_total: {
                    currency_code: 'USD',
                    value: this.totalPrice.toFixed(2)
                  }
                }
              },
              items: [{
                name: 'Rick And Ray Online Shopping',
                quantity: '1',
                category: 'DIGITAL_GOODS',
                unit_amount: {
                  currency_code: 'USD',
                  value: `${this.totalPrice.toFixed(2)}`
                }
              }]
            }],
          }
          );
        },
        advanced: {
          commit: 'true'
        },
        onApprove: async (data, actions) => {
          this.isLoading = true;
          window.scrollTo(0, 0);
          await actions.order.capture();
          this.paidItems.push(...this.items);
          this.cartHelper.addToPaidFor(this.paidItems).then((success: boolean) => {
            if (success) {
              this.cartHelper.clearCart(this.user.userId)
                .then((success: boolean) => {
                  if (success) {
                    this.items = this.items.splice(0, this.items.length);
                    this.totalItems = 0;
                    this.totalPrice = 0;
                    window.scrollTo(0, 0);
                    setTimeout(() => {
                      this.notifyService.showSuccess("Items Successfully Paid For", "Transaction Successful");
                      this.isLoading = false;
                      this.zone.run(() => {
                        this.router.navigate(['/deliveries']);
                      });
                    }, 500);
                  } else {
                    setTimeout(() => {
                      this.notifyService.showError('Please try again', 'Unable to Complete Payment');
                      this.isLoading = false;
                    }, 500);
                  }
                }).catch(error => { throw new Error(error); });
            } else {
              this.notifyService.showError('Please try again', 'Unable to Complete Payment');
              this.isLoading = false;
            }
          }).catch(error => { throw new Error(error); });
        },
        onClientAuthorization: (data => {
          console.log(data)
        }),
        onCancel: (data, actions) => {
          console.log(data, actions)
        },
        onError: err => {
          this.isLoading = true;
          this.notifyService.showError('Please try again', `Unable to Complete Payment: Error ${err}`);
          this.isLoading = false;
        }
      })
      .render(this.paypalElement.nativeElement);
  }

  removeProduct(cartID: number, cartItemID: number) {
    try {
      if (confirm('Are you sure?')) {
        this.isLoading = true;
        this.service.deleteCartItem(cartID, cartItemID).subscribe(result => {
          if (result) {
            this.notifyService.showInfo('', 'Product removed from cart');
            new Promise(resolve => {
              this.items.splice(0, this.items.length);
              this.service.getItems(this.user.userId).subscribe(data => {
                this.items = data;
                if (this.items.length > 0) {
                  this.totalPrice = this.cartHelper.calculateTotalPrice(this.items);
                  this.totalItems = this.cartHelper.getCartCount(this.items);
                } else {
                  this.isLoading = false;
                  this.router.navigate(["/no-cart-items"]);
                }
              });
              resolve(this.service.getCartCount(this.user.userId)
                .subscribe((count: number) => { 
                  this.service.cartCountUpdate(count); 
                  this.isLoading = false;
                }));
            });
          } else {
            this.notifyService.showError('', 'Unable to remove item from cart');
            this.isLoading = false;
          }
        });
      } else { return; }
    } catch (error) {
      throw new Error(error);
    }
  }

  updateProduct(cartID: number, cartItemID: number, quantity: number) {
    try {
      if (confirm('Are you sure?')) {
        window.scrollTo(0, 0);
        this.isLoading = true;
        this.service.updateCartItem(cartID, cartItemID, quantity).subscribe(result => {
          if (result) {
            this.notifyService.showSuccess(`Quantity: ${quantity}`, 'Item updated successfully');
            let cartCount: number = 0;
            new Promise(resolve => {
              this.items.splice(0, this.items.length);
              this.service.getItems(this.user.userId).subscribe(data => {
                this.items = data;
                this.totalPrice = this.cartHelper.calculateTotalPrice(this.items);
                this.totalItems = this.cartHelper.getCartCount(this.items);
              });
              resolve(this.service.getCartCount(this.user.userId).subscribe((data: number) => {
                cartCount = data;
                setTimeout(() => {
                  this.service.cartCountUpdate(cartCount);
                  this.isLoading = false;
                }, 100);
              }));
            });
          } else {
            this.notifyService.showError('', `Unable to update product`);
            this.isLoading = false;
          }
        });
      } else { return; }
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
