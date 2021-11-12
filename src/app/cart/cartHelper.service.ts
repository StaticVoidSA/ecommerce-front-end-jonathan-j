import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { AuthRespData } from "../auth/login/auth-resp-data.model";
import { LoginService } from "../auth/login/login.service";
import { CartItem, CartService } from "../shared/cart.service";
import { PaidForItemsService } from "../shared/paiditems.service";
import { ShopHelperService } from "../shop/shopHelper.service";
import { NotificationService } from '../notification.service';

@Injectable({ providedIn: 'root' })
export class CartHelperService {

    constructor(private router: Router,
        private shopHelper: ShopHelperService,
        private cartService: CartService,
        private paidService: PaidForItemsService,
        private loginService: LoginService,
        private notifyService: NotificationService) { }

    calculateTotalPrice(items: CartItem[]): number {
        let total = 0.00;
        items.forEach(item => {
            total += (item.price * item.quantity);
        });
        return total;
    }

    getCartCount(items: CartItem[]): number {
        let count = 0;
        items.forEach(item => {
            count += item.quantity;
        });
        return count;
    }

    getCartItemData (userId, item, num) {
        const promise = new Promise(resolve => {
            const cartItem: any = {
                userID: userId,
                cartID: userId,
                title: item.ingredientTitle,
                brand: item.brand,
                price: item.price,
                quantity: 1,
                barcode: item.barcode,
                productID: num++
            }
            resolve(cartItem);
        });
        return promise;
    }

    addToCart(title: string, barcode: string, brand: string,
        quantity: number, price: number, productID: string, cartCount: number): void {
        this.shopHelper.getUserDetails()
            .then((user: AuthRespData) => {
                if (user.userRole && user.loggedIn === true) {
                    this.shopHelper.getCartItemData(title, barcode, brand, quantity, price, productID, user.userId)
                        .then((item: CartItem) => {
                            this.cartService.addToCart(item).subscribe((success: boolean) => {
                                if (success) {
                                    this.notifyService.showInfo(`${title}`, `Item Added To Cart`);
                                    cartCount++;
                                    this.cartService.cartCountUpdate(cartCount);
                                } else {
                                    this.notifyService.showError(`${title}`, `Unable To Add Item To Cart`);
                                }
                            });
                        }).catch(error => { throw new Error(error); });
                } else {
                    setTimeout(() => {
                        this.router.navigate(['/user-not-logged-in']);
                    }, 500)
                }
            }).catch(error => { throw new Error(error); });
    }

    clearCart(userId: number) {
        const promise = new Promise((resolve, reject) => {
            this.cartService.clearCart(userId).subscribe((success: boolean) => {
                if (success) {
                    let count: number = 0
                    this.cartService.cartCountUpdate(count);
                    resolve(success);
                } else {
                    reject(`Unable to clear cart for user: ${userId}`);
                }
            });
        });
        return promise;
    }

    addToPaidFor(items: CartItem[]) {
        const promise = new Promise((resolve) => {
            items.forEach(item => {
                this.paidService.addToPaidItems(item).subscribe((success: boolean) => {
                    resolve(success);
                });
            });
        });
        return promise;
    }

    getUserDetails() {
        const promise = new Promise(resolve => {
            this.loginService.currentUser.subscribe((user: AuthRespData) => {
                resolve(user);
            });
        });
        return promise;
    }

    getItems(userID: number) {
        const promise = new Promise(resolve => {
            this.cartService.getItems(userID).subscribe((items: CartItem[]) => {
                resolve(items);
            });
        });
        return promise;
    }
}