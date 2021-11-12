import { Injectable } from "@angular/core";
import { AuthRespData } from "../auth/login/auth-resp-data.model";
import { LoginService } from "../auth/login/login.service";
import { CartItem } from "../shared/cart.service";
import { Favorites, FavoritesService, GetFavorites } from "../shared/favorites.service";
import { SearchRespData } from "../shared/models/SearchRespData.model";
import { ShoppingList, ShoppingListService } from "../shared/shoppinglist.service";
import { MatDialog } from '@angular/material/dialog';
import { ListDialogComponent } from "../shopping-list/list-dialog/list-dialog.component";
import { Router } from "@angular/router";
import { HttpParams } from "@angular/common/http";
import { NotificationService } from '../notification.service';

@Injectable({ providedIn: 'root' })
export class ShopHelperService {

    public httpParams = new HttpParams();

    constructor(private userService: LoginService,
        private shoppingListService: ShoppingListService,
        public dialog: MatDialog,
        private router: Router,
        private favoriteService: FavoritesService,
        private loginService: LoginService, 
        private notifyService: NotificationService) { }

    pushItems = (items: SearchRespData[], arr: any[]) => {
        items.forEach(product => {
            arr.push(product.price);
            arr.push(product.brand);
            arr.push(product.quantity);
        });
    }

    getCartItemData = (title: string, barcode: string, brand: string,
        quantity: number, price: number, productID: string, userId: number) => {
        const promise = new Promise(resolve => {
            const item: CartItem = {
                userID: userId,
                cartID: userId,
                productID: productID,
                title: title,
                barcode: barcode,
                brand: brand,
                quantity: quantity,
                price: price
            }
            resolve(item);
        });
        return promise;
    }

    getFavoriteItemData = (productID: number, title: string, description: string,
        brand: string, quantity: string, uri: string, price: number, barcode: string, userId: number) => {
        const promise = new Promise(resolve => {
            const favorite: Favorites = {
                productID: productID,
                title: title,
                description: description,
                brand: brand,
                quantity: quantity,
                uri: uri,
                price: price,
                userID: userId,
                barcode: barcode,
                favID: userId
            }
            resolve(favorite);
        });
        return promise;
    }

    getShoppingListData = (productTitle: string, brand: string, barcode: string,
        quantity: number, price: number, userId: number, listName: string) => {
        const promise = new Promise(resolve => {
            const list: ShoppingList = {
                title: productTitle,
                brand: brand,
                barcode: barcode,
                quantity: +quantity,
                price: price,
                userID: userId,
                shoppingListName: listName,
                shoppingListID: userId
            }
            resolve(list);
        });
        return promise;
    }

    getUserDetails = () => {
        const promise = new Promise(resolve => {
            this.userService.currentUser.subscribe((user: AuthRespData) => {
                resolve(user);
            });
        });
        return promise;
    }

    getListCount = (userId: number) => {
        const promise = new Promise(resolve => {
            this.shoppingListService.getListCount(userId).subscribe((count: number) => {
                resolve(count);
            });
        });
        return promise;
    }

    clearData = (brands: string[], prices: number[], quantities: string[], uniqueBrands: string[],
        uniquePrices: number[], uniqueQuantities: string[]) => {
        brands.splice(0, brands.length);
        prices.splice(0, prices.length);
        quantities.splice(0, quantities.length);
        uniqueBrands.splice(0, uniqueBrands.length);
        uniquePrices.splice(0, uniquePrices.length);
        uniqueQuantities.splice(0, uniqueQuantities.length);
    }

    openDialog = (productTitle: string, brand: string, barcode: string, quantity: number, price: number) => {
        const dialogRef = this.dialog.open(ListDialogComponent, {
            width: 'auto',
            height: 'auto',
            data: {},
            backdropClass: 'backdropBackground'
        });

        isNaN(quantity) && (quantity = 1);

        dialogRef.afterClosed().subscribe(data => {
            this.getUserDetails()
                .then((user: AuthRespData) => {
                    this.getShoppingListData(productTitle, brand, barcode, +quantity, price, user.userId, data)
                        .then((list: ShoppingList) => {
                            this.shoppingListService.addToShoppingList(list).subscribe((success: boolean) => {
                                setTimeout(() => {
                                    if (success) {
                                        this.notifyService.showInfo(`${productTitle}`, `Product Added To Shopping List ${list.shoppingListName}`)
                                    } else {
                                        this.notifyService.showError(`${productTitle}`, `Unable To Add Item To Shopping List ${list.shoppingListName}`)
                                    }
                                }, 500);
                            });
                        }).catch(error => { throw new Error(error); });
                }).catch(error => { throw new Error(error); });
        });
    }

    addToFavorites = (productID: number, title: string, description: string,
        brand: string, quantity: string, uri: string, price: number, barcode: string) => {
        this.getUserDetails()
            .then((user: AuthRespData) => {
                if (!user.userRole && user.loggedIn !== true) {
                    setTimeout(() => {
                        this.router.navigate(['/user-not-logged-in']);
                    }, 500);
                } else {
                    this.getFavoriteItemData(productID, title, description, brand, quantity, uri, price, barcode, user.userId)
                        .then((favorite: Favorites) => {
                            this.favoriteService.addToFavorites(favorite).subscribe((success: boolean) => {
                                if (success) {
                                    this.notifyService.showInfo(`${title}`, `Added Item To Favorites`);
                                } else {
                                    this.notifyService.showError(`${title}`, `Unable To Add Item To Favorites`);
                                }
                            });
                        }).catch(error => { throw new Error(error); });
                }
            }).catch(error => { throw new Error(error); });
    }

    addToShoppingList = (productTitle: string, brand: string, barcode: string,
        quantity: number, price: number) => {
        this.getUserDetails()
            .then((user: AuthRespData) => {
                if (!user.userRole && !user.loggedIn) {
                    setTimeout(() => {
                        this.router.navigate(["/user-not-logged-in"]);
                    }, 500);
                } else {
                    this.shoppingListService.getListCount(user.userId).subscribe((data: number) => {
                        if (data > 0) {
                            this.openDialog(productTitle, brand, barcode, quantity, price);
                        } else {
                            this.notifyService.showWarning('', `You Have No Shopping Lists!`);
                            this.router.navigate(['/shoppinglist']);
                        }
                    });
                }
            }).catch(error => { throw new Error(error); });
    }

    removeFromFavorites = (ID: number, favID: number, favorites: Favorites[]) => {
        if (confirm('Are you sure?')) {
            new Promise(resolve => {
                this.loginService.currentUser.subscribe((user: AuthRespData) => {
                    resolve(this.favoriteService.removeFromFavorites(ID, favID).subscribe((success: boolean) => {
                        if (success) {
                            favorites.splice(0, favorites.length);
                            setTimeout(() => {
                                this.favoriteService.getFavorites(user.userId).subscribe((items: GetFavorites[]) => {
                                    favorites.push(...items);
                                    if (favorites.length > 0) {
                                        return;
                                    } else {
                                        this.router.navigate(['/no-current-favorites']);
                                    }
                                });
                                this.notifyService.showInfo(`Favorite ID: ${favID}`, `Removed Item From Favorites`);
                                window.scrollTo(0, 0);
                            }, 100);
                        } else {
                            this.notifyService.showError(`Favorite ID: ${favID}`, `Unable To Remove From Favorites`);
                        }
                    }));
                });
            });
        } else { return; }
    }

    gatherBrands = (searchItems: SearchRespData[], brands: string[]) => {
        searchItems.forEach(product => {
            brands.push(product.brand);
        });
        brands.sort((a, b) => {
            if (a > b) return 1;
            if (a == b) return 0;
            if (a < b) return -1; 
        });
        return Array.from(new Set(brands));
    }

    gatherPrices = (searchItems: SearchRespData[], prices: number[]) => {
        searchItems.forEach(product => {
            prices.push(product.price);
        });
        prices.sort((n1, n2) => n1 - n2);
        return Array.from(new Set(prices));
    }

    gatherQuantities = (searchItems: SearchRespData[], quantities: string[]) => {
        searchItems.forEach(product => {
            quantities.push(product.quantity);
        });
        quantities.sort((a, b) => {
            if (a > b) return 1;
            if (a == b) return 0;
            if (a < b) return -1; 
        });
        return Array.from(new Set(quantities));
    }

    paramMaker = (data): HttpParams => {
        Object.keys(data).forEach((key) => {
            if (Array.isArray(data[key])) {
                data[key].forEach((item, index) => {
                    this.httpParams = this.httpParams.append(key + '[' + index + ']', item);
                });
            }
            else {
                this.httpParams = this.httpParams.append(key, data[key]);
            }
        });
        return this.httpParams;
    }
}