import { Component, OnInit, ViewChild } from '@angular/core';
import { SearchRespData } from '../shared/models/SearchRespData.model';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { NavSearchService } from '../shared/navsearch.service';
import { ShopService } from '../shared/shop.service';
import { SearchRequestData } from '../shared/models/SearchReqData.model';
import { CartService } from '../shared/cart.service';
import { LoginService } from '../auth/login/login.service';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { UserShoppingList } from '../shared/shoppinglist.service';
import { MatDialog } from '@angular/material/dialog';
import { ShopHelperService } from './shopHelper.service';
import { CartHelperService } from '../cart/cartHelper.service';
import { HomeHelperService } from '../home/homeHelper.service';
import { PageEvent } from '@angular/material/paginator';

interface DialogData {
  listName: string[];
}

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent implements OnInit {

  public searchItems: SearchRespData[] = [];
  public products: SearchRespData[] = [];
  public page: number = 0;
  public size: number = 3;
  public category: string;
  private searchItem: string;
  public brands: string[] = [];
  public prices: number[] = [];
  public quantities: string[] = [];
  public uniqueBrands: string[] = [];
  public uniquePrices: number[] = [];
  public uniqueQuantities: string[] = [];
  public isLoading: boolean = false;
  public barcode: string;
  public user: AuthRespData;
  public loggedIn: boolean = false;
  public cartCount: number;
  public amount: number = 1;
  public userShoppingLists: UserShoppingList[] = [];
  public listNames: DialogData[] = [];
  public chosenList: DialogData;
  public connected: boolean = false;
  public hasAddedToCart: boolean = false;
  public dataSource: any;
  public pricesCheckboxData: any[] = [];

  constructor(private router: Router,
    private route: ActivatedRoute,
    private navService: NavSearchService,
    private shopService: ShopService,
    private cartService: CartService,
    private userService: LoginService,
    public dialog: MatDialog,
    private shopHelper: ShopHelperService,
    private cartHelper: CartHelperService,
    private homeHelper: HomeHelperService) { }

  ngOnInit() {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise(resolve => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.userService.currentUser.subscribe((user: AuthRespData) => { 
        if (user) {
          this.user = user;
          setTimeout(() => {
            this.cartService.getCartCount(this.user.userId).subscribe((count: number) => { 
              this.cartCount = count; 
              this.cartService.cartCountUpdate(this.cartCount);
            });
          }, 100);
          resolve(this.cartService.currentitems.subscribe((count: number) => {
            this.cartCount = count;
          }));
        } else {
          this.cartCount = 0;
          this.user = {
            token: null,
            userId: null,
            userName: null,
            expiresIn: null,
            loggedIn: false,
            userRole: null,
            success: null
          };
        }
       });
    });

    const RoutePromise = new Promise(resolve => {
      resolve(this.route.params.subscribe((params: Params) => {
        this.isLoading = true;
        this.shopHelper.clearData(this.brands, this.prices, this.quantities,
          this.uniqueBrands, this.uniquePrices, this.uniqueQuantities);
        setTimeout(() => {
          this.searchItem = params.item;
          this.barcode = params.item.barcode;
          this.navService.searchItemsNavbar(this.searchItem).subscribe(data => {
            console.log(data.length);
            if (data[0].productID > 0) {
              this.searchItems = data;
              this.getPaginationData({pageIndex: this.page, pageSize: this.size});
              this.uniqueBrands = this.shopHelper.gatherBrands(this.searchItems, this.brands);
              this.uniquePrices = this.shopHelper.gatherPrices(this.searchItems, this.prices);
              this.uniqueQuantities = this.shopHelper.gatherQuantities(this.searchItems, this.quantities);

              this.getPricesCheckboxData();
              setTimeout(() => {
                this.isLoading = false;
              }, 100);              
            } else {
              setTimeout(() => {
                this.isLoading = false;
                this.router.navigate(["/items-not-found"]);
              }, 100);
            }
          });
        }, 100);
      }));
    });

    async function Init() {
      await InitPromise;
      await RoutePromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init().catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  gatherData(searchItems: SearchRespData[]) {
    this.uniquePrices = this.shopHelper.gatherPrices(searchItems, this.prices);
    this.uniqueBrands = this.shopHelper.gatherBrands(searchItems, this.brands);
    this.uniqueQuantities = this.shopHelper.gatherQuantities(searchItems, this.quantities);
  }

  getPricesCheckboxData() {
    if (this.uniquePrices.length > 4)
    {
      this.pricesCheckboxData = [
        {
          minRange: this.uniquePrices[0],
          maxRange: this.uniquePrices[Math.floor((this.uniquePrices.length / 4) - 1)]
        },
        {
          minRange: this.uniquePrices[Math.floor(this.uniquePrices.length / 4)],
          maxRange: this.uniquePrices[Math.floor(this.uniquePrices.length / 2) - 1]
        },
        {
          minRange: this.uniquePrices[Math.floor(this.uniquePrices.length / 2)],
          maxRange: this.uniquePrices[Math.floor(this.uniquePrices.length - 1)]
        }
      ];
    }
    else if (this.uniquePrices.length <= 4 && this.uniquePrices.length > 2){
      this.pricesCheckboxData = [
        {
          minRange: this.uniquePrices[0],
          maxRange: this.uniquePrices[Math.floor(this.uniquePrices.length / 2) - 1]
        },
        {
          minRange: this.uniquePrices[Math.floor(this.uniquePrices.length / 2)],
          maxRange: this.uniquePrices[Math.floor(this.uniquePrices.length) - 1]
        }
      ];
    }
    else if (this.uniquePrices.length <= 2 && this.uniquePrices.length > 1 ) {
      this.pricesCheckboxData = [
        {
          minRange: this.uniquePrices[0],
          maxRange: this.uniquePrices[1]
        }
      ]
    }
    else if (this.uniquePrices.length === 1) {
      this.pricesCheckboxData = [
        {
          minRange: this.uniquePrices[0],
          maxRange: this.uniquePrices[0]
        }
      ]
    }
  }

  getPaginationData(obj) {
    let index = 0;
    let startingIndex = obj.pageIndex * obj.pageSize;
    let endingIndex = startingIndex + obj.pageSize;

    this.products = this.searchItems.filter(() => {
      index++;
      return (index > startingIndex && index <= endingIndex) ? true : false;
    });
  }

  filterBrand(brand: string) {
    try {
      this.isLoading = true;
      this.shopHelper.clearData(this.brands, this.prices, this.quantities,
        this.uniqueBrands, this.uniquePrices, this.uniqueQuantities);
      this.uniqueBrands.push(brand);
      this.category = this.searchItems[0].category;
      const request: SearchRequestData = {
        brand: brand,
        category: this.category,
        price: null,
        quantity: null
      }
      this.shopService.filterByBrand(request).subscribe((data: SearchRespData[]) => {
        this.searchItems.splice(0, this.searchItems.length);
        this.searchItems.push(...data);
        this.getPaginationData({pageIndex: this.page, pageSize: this.size});
        this.shopHelper.pushItems(this.searchItems, this.uniqueBrands);
        this.gatherData(this.searchItems);
        this.getPricesCheckboxData(); 
      });
      setTimeout(() => {
        this.isLoading = false;
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error) {
      throw new Error(error);
    }
  }

  filterPrice(minRange: number, maxRange: number) {
    try {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.shopHelper.clearData(this.brands, this.prices, this.quantities,
        this.uniqueBrands, this.uniquePrices, this.uniqueQuantities);
      this.category = this.searchItems[0].category;
      const request: SearchRequestData = {
        price: null,
        minRange: minRange,
        maxRange: maxRange,
        category: this.category,
        brand: null,
        quantity: null
      }
      this.shopService.filterByPrice(request).subscribe(data => {
        this.searchItems.splice(0, this.searchItems.length);
        this.searchItems.push(...data);
        this.getPaginationData({pageIndex: this.page, pageSize: this.size});
        this.shopHelper.pushItems(this.searchItems, this.uniquePrices);
        this.gatherData(this.searchItems);
        this.searchItems.sort();
        this.getPricesCheckboxData(); 
      });
      setTimeout(() => {
        this.isLoading = false;
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error) {
      throw new Error(error);
    }
  }

  filterQuantity(quantity: string) {
    try {
      this.isLoading = true;
      this.shopHelper.clearData(this.brands, this.prices, this.quantities,
        this.uniqueBrands, this.uniquePrices, this.uniqueQuantities);
      this.category = this.searchItems[0].category;
      const request: SearchRequestData = {
        price: null,
        category: this.category,
        brand: null,
        quantity: quantity
      }
      this.shopService.filterByQuantity(request).subscribe(data => {
        this.searchItems.splice(0, this.searchItems.length);
        this.searchItems.push(...data);
        this.getPaginationData({pageIndex: this.page, pageSize: this.size});
        this.shopHelper.pushItems(this.searchItems, this.uniqueQuantities);
        this.gatherData(this.searchItems);
        this.getPricesCheckboxData(); 
      });
      setTimeout(() => {
        this.isLoading = false;
        window.scrollTo(0, 0);
      }, 1500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddToCart(title: string, barcode: string, brand: string,
    quantity: number, price: number, productID: string) {
    try {
      this.hasAddedToCart = true;
      this.cartHelper.addToCart(title, barcode, brand, quantity, price, productID, this.cartCount);
      setTimeout(() => {
        this.hasAddedToCart = false;
      }, 750);
    } catch (error) {
      throw new Error(error);
    }
  }

  onAddTofavorites(productID: number, title: string, description: string,
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

  scrollToTop() {
    window.scrollTo(0, 0);
  }
}