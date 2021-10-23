import { Component, OnInit } from '@angular/core';
import { UserLocation } from 'src/app/shared/models/userlocation.model';
import { LoginService } from 'src/app/auth/login/login.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HeaderService } from './header.service';
import { CartService } from 'src/app/shared/cart.service';
import { AuthenticationService } from 'src/app/shared/auth.service';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})

export class HeaderComponent implements OnInit {

  constructor(private loginService: LoginService,
    private router: Router,
    private headerService: HeaderService,
    public route: ActivatedRoute,
    private cartService: CartService,
    private authService: AuthenticationService) { }

  public userLocation: UserLocation = {
    Address: null,
    Country: null,
    Town: null,
    Lat: null,
    Long: null
  };

  public locations: string[] = [
    "Free State",
    "Eastern Cape",
    "Gauteng",
    "Kwazulu Natal",
    "Western Cape"
  ]

  public loggedIn: boolean = false;
  public isLoading: boolean = false;

  public authRespData = {
    userRole: null,
    expiresIn: null,
    loggedIn: false,
    token: null,
    userId: null,
    userName: null,
    success: null
  };

  ngOnInit() {
    const LocationPromise = new Promise((resolve) => {
      this.headerService.getLocation();
      resolve(setTimeout(() => {
        this.headerService.currentLocation.subscribe((location: UserLocation) => {
          if (!location) {
            this.userLocation = {
              Address: null,
              Country: "Unknown",
              Lat: null,
              Long: null,
              Town: null
            };
          }
          else {
            this.userLocation = location;
          }
        });
      }, 50));
    });

    const RoutePromise = new Promise((resolve) => {
      resolve(this.route.data.subscribe((data: UserLocation) => {
        this.userLocation = data;
      }));
    });

    const UserPromise = new Promise(() => {
      this.loginService.currentUser.subscribe((user: AuthRespData) => {
        if (!user.loggedIn || !user.userId) {
          this.authRespData = {
            userRole: "browser",
            expiresIn: null,
            loggedIn: false,
            token: null,
            userId: null,
            userName: null,
            success: null
          };
        } else {
          this.authRespData = user;
        }
      });
    });

    async function GetLocation() {
      await LocationPromise;
    }

    async function GetRouteData() {
      await RoutePromise;
    }

    async function GetUserData() {
      await UserPromise;
    }

    try {
      GetUserData()
        .then(GetRouteData)
        .then(GetLocation)
        .catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  onLocationChanged(location: string) {
    this.headerService.changeLocation(location)
    .then((location: string) => {
      this.userLocation.Country = location; 
      this.headerService.location.emit(this.userLocation);
      this.headerService.userDetails.next(this.userLocation);
      console.log(this.userLocation);
    }).catch(error => { throw new Error(error); });
  }

  onNavigateUsers() {
    this.loginService.emittedUserDetails.emit(this.authRespData);
    this.router.navigate(["/users"]);
  }

  onLogout() {
    this.authRespData.userRole = null;
    this.authRespData.expiresIn = null;
    this.authRespData.loggedIn = false;
    this.authRespData.token = null;
    this.authRespData.userName = null;
    this.authRespData.userId = null;
    let cartCount = 0;

    this.authService.userTokenUpdate(null);
    sessionStorage.setItem('user_email', null);
    this.cartService.cartCountUpdate(cartCount);
    this.loginService.updateUserDetails(this.authRespData);
    this.authService.logout();
  }
}
