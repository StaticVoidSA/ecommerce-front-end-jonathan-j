import { Injectable } from "@angular/core";
import { CartItem, CartService } from "../shared/cart.service";
import { ShoppingList } from "../shared/shoppinglist.service";
import { Specials } from "../shared/specials.service";

@Injectable({ providedIn: 'root' })
export class SpecialsHelperService {

    constructor(private cartService: CartService) { }

    getShoppingListData(productTitle: string, brand: string, barcode: string, quantity: number, price: number,
        userId: number, data: any) {
        const promise = new Promise(resolve => {
            const list: ShoppingList = {
                title: productTitle,
                brand: brand,
                barcode: barcode,
                quantity: +quantity,
                price: price,
                userID: userId,
                shoppingListName: data,
                shoppingListID: userId
            }
            resolve(list);
        });
        return promise;
    }

    addSpecialToCart(special: Specials, userID: number) {
        const promise = new Promise((resolve, reject) => {
            var cartItem: CartItem = {
                userID: userID,
                cartID: userID,
                title: special.title,
                brand: special.brand,
                price: special.price,
                quantity: 1,
                productID: special.productID.toString(),
                barcode: special.barcode
            }
            this.cartService.addToCart(cartItem).subscribe((response: boolean) => {
                if (response) {
                    resolve(true);
                } else {
                    reject("Unable to add special to cart");
                }
            });
        });
        return promise;
    }
}
