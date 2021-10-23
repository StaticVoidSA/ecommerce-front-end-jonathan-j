import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { CartHelperService } from "../cart/cartHelper.service";
import { UserService } from "../navigation/header/users/user.service";
import { CartItem, CartService } from "../shared/cart.service";
import { ShoppingListService, UserShoppingList } from "../shared/shoppinglist.service";

@Injectable({ providedIn: 'root' })
export class ShoppingListHelper {

    constructor(private shoppingListService: ShoppingListService,
        private cartService: CartService,
        private cartHelper: CartHelperService,
        private router: Router,
        private userService: UserService) { }

    getListData(userId, form) {
        const promise = new Promise(resolve => {
            const list: UserShoppingList = {
                userID: userId,
                shoppingListName: form.value.listName,
                listID: null
            }
            resolve(list);
        });
        return promise;
    }

    getUserDetails(updatedUser, userDetails, userForm) {
        const promise = new Promise((resolve, reject) => {
            if (!updatedUser || !userDetails || !userForm) {
                reject(`Invalid User Details`);
            }
            updatedUser._email = userDetails.email;
            updatedUser.userRole = userDetails.userRole;
            updatedUser.doj = userForm.value.userData.doj;
            updatedUser.firstName = userForm.value.userData.firstName;
            updatedUser.surname = userForm.value.userData.surname;
            updatedUser.email = userForm.value.userData.email;
            resolve(updatedUser);
        });
        return promise;
    }

    deleteList = (itemID: number, userID: number, shoppingLists: any[]) => {
        if (confirm('Are you sure?')) {
            shoppingLists.splice(0, shoppingLists.length);
            this.shoppingListService.deleteShoppingList(itemID, userID).subscribe((data: boolean) => {
                setTimeout(() => {
                    if (data) {
                        alert(`Deleted Shopping List successfully`);
                        this.shoppingListService.getUserShoppingList(userID).subscribe((data: UserShoppingList[]) => {
                            shoppingLists.push(...data);
                        });
                    } else {
                        alert(`Unable To Delete Shopping List`);
                    }
                }, 500);
            });
        } else {
            return;
        }
    }

    removeFromCart = (cartID: number, cartItemID: number, cartItems: CartItem[],
        userId: number, totalPrice: number, totalItems: number) => {
        this.cartService.deleteCartItem(cartID, cartItemID).subscribe(result => {
            if (result) {
                alert(`Product successfully removed from cart`);
                new Promise((resolve) => {
                    cartItems.splice(0, cartItems.length);
                    this.cartService.getItems(userId).subscribe(items => {
                        cartItems = items;
                        if (cartItems.length > 0) {
                            totalPrice = this.cartHelper.calculateTotalPrice(cartItems);
                            totalItems = this.cartHelper.getCartCount(cartItems);
                        } else {
                            this.router.navigate(["/no-cart-items"]);
                        }
                    });
                    resolve(this.cartService.getCartCount(userId).subscribe((count: number) => {
                        this.cartService.cartCountUpdate(count);
                    }));
                });
            } else {
                alert(`Unable to remove item from cart`);
            }
        });
    }

    createShoppingList = (userId: number, form: any, shoppingLists: UserShoppingList[]) => {
        this.getListData(userId, form)
            .then((list: UserShoppingList) => {
                this.shoppingListService.createShoppingList(list).subscribe((success: boolean) => {
                    if (success) {
                        alert(`Created Shopping List: ${list.shoppingListName}`);
                        shoppingLists.splice(0, shoppingLists.length);
                        this.shoppingListService.getUserShoppingList(userId).subscribe((lists: UserShoppingList[]) => {
                            shoppingLists.push(...lists);
                        });
                    } else {
                        alert(`Unable To Create Shopping List ${list.shoppingListName}`);
                    }
                });
            }).catch(error => { throw new Error(error); });
    }

    updateUser = (updatedUser, userDetails, userForm) => {
        this.getUserDetails(updatedUser, userDetails, userForm)
            .then((updatedUser: any) => {
                this.userService.editUser(updatedUser).subscribe((data: boolean) => {
                    if (data) {
                        alert('Updated User Successfully');
                    } else {
                        alert('Unable To Update User');
                    }
                });
            }).catch(error => { throw new Error(error); });
    }
}