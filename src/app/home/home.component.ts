import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../navigation/header/header.service';
import { LoginService } from '../auth/login/login.service';
import { CartService } from '../shared/cart.service';
import { Product } from '../shared/models/product.model';
import { Specials } from '../shared/specials.service';
import { HomeHelperService } from './homeHelper.service';
import { UserLocation } from '../shared/models/userlocation.model';
import { AuthRespData } from '../auth/login/auth-resp-data.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public userLocaton: any;
  public cartItem: Product;
  public authRespData: any;
  public cartCount: number;
  public sportsSpecials: Specials[] = [];
  public petsSpecials: Specials[] = [];
  public fruitSpecials: Specials[] = [];
  public bakerySpecials: Specials[] = [];
  public specials: Specials[] = [];
  public connected: boolean = false;

  constructor(private headerService: HeaderService,
    private userService: LoginService,
    private cartService: CartService,
    private homeHelper: HomeHelperService) { }

  ngOnInit() {
    window.addEventListener('online', () => { this.connected = true; });
    window.addEventListener('offline', () => { this.connected = false; });

    const InitPromise = new Promise(() => {
      window.scrollTo(0, 0);
      this.headerService.currentLocation.subscribe((location: UserLocation) => {
        this.userLocaton = location;
      });
    });

    const CartPromise = new Promise(() => {
      this.userService.currentUser.subscribe((user: AuthRespData) => {
        this.cartService.getCartCount(user.userId).subscribe((count: number) => {
          !count ? this.cartCount = 0 : this.cartCount = count;
          this.cartService.cartCountUpdate(count);
        });
      });
    });

    const SpecialsPromise = new Promise(() => {
      this.getSpecials();
    });

    async function Init() {
      await InitPromise;
    }

    async function Cart() {
      await CartPromise;
    }

    async function Specials() {
      await SpecialsPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      Init()
        .then(Cart)
        .then(Specials)
        .catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  clearSpecials = (): void => {
    this.sportsSpecials.splice(0, this.sportsSpecials.length);
    this.petsSpecials.splice(0, this.petsSpecials.length);
    this.fruitSpecials.splice(0, this.fruitSpecials.length);
    this.bakerySpecials.splice(0, this.bakerySpecials.length);
    this.specials.splice(0, this.specials.length);
  }

  getSpecials = (): void => {
    const info = [
      { title: 'Sports', arr: this.sportsSpecials },
      { title: 'Pets', arr: this.petsSpecials },
      { title: 'Fruit', arr: this.fruitSpecials },
      { title: 'Bakery', arr: this.bakerySpecials }
    ];

    try {
      this.clearSpecials();
      let rnd = Math.floor(Math.random() * 5);

      info.forEach(item => {
        this.homeHelper.getSpecialsDetails(item.title)
          .then((data: Specials[]) => {
            item.arr.push(...data);
            this.specials.push(item.arr[rnd]);
          })
          .catch(error => { throw new Error(error); });
      });
    } catch (error) {
      throw new Error(error);
    }
  }
}

