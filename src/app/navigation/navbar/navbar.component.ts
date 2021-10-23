import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { NavSearchService } from 'src/app/shared/navsearch.service';
import { SearchRespData } from 'src/app/shared/models/SearchRespData.model';
import { Subscription } from 'rxjs';
import { CartService } from 'src/app/shared/cart.service';
import { Product } from 'src/app/shared/models/product.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit, OnDestroy {

  constructor(private router: Router,
    private navService: NavSearchService,
    private cartService: CartService) { }

  searchSubscription = new Subscription();
  items: any = [] = [];
  searchItem: string;
  cartCount: number = 0;
  cartItems: Product[] = [];
  loggedIn: boolean = false;

  ngOnInit() {
    this.items = [];
    this.cartService.emittedCartItem.subscribe(() => {
      this.cartCount++;
    });
    this.cartService.currentitems.subscribe(data => {
      this.cartCount = data;
    })
  }

  onCartNav() {
    this.router.navigate(['/cart'])
  }

  onDeliveriesNav() {
    this.router.navigate(['/deliveries']);
  }

  onFavoritesNav() {
    this.router.navigate(['/favorites']);
  }

  onShoppingListsNav() {
    this.router.navigate(['/shoppinglist']);
  }

  onSearchSubmit(form: NgForm) {
    try {
      if (form.value.searchItem === '' || form.value.searchItem === null) {
        return;
      }
      
      this.items.splice(0, this.items.length);
      let _searchValue = form.value.searchItem.replace(/\s/g, "");

      this.searchSubscription = this.navService.searchItemsNavbar(_searchValue).subscribe((data: SearchRespData[]) => {
        this.items.push(...data);
        this.router.navigate(["/shop", _searchValue]);
      });
    } catch (error) {
      throw new Error(error);
    }
  }

  ngOnDestroy() {
    this.searchSubscription.unsubscribe();
  }
}
