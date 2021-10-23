import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDatepicker } from '@angular/material/datepicker';
import { Router } from '@angular/router';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { LoginService } from '../auth/login/login.service';
import { HomeHelperService } from '../home/homeHelper.service';
import { Address, AddressService } from '../shared/address.service';
import { PaidItems } from '../shared/paiditems.service';
import { DeliveriesHelper, ShopName } from './deliveriesHelper.service';

@Component({
  selector: 'app-deliveries',
  templateUrl: './deliveries.component.html',
  styleUrls: ['./deliveries.component.css']
})
export class DeliveriesComponent implements OnInit {

  public isLoading: boolean = false;
  public addresses: Address[] = [];
  public user: AuthRespData;
  public userEmail: string = null;
  public paneOpen: boolean = false;
  public deliveryStringDate: Date;
  public deliveryDate: Date;
  @ViewChild('addressForm') addressForm: NgForm;
  @ViewChild('picker') picker: MatDatepicker<Date>;
  public options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  public connected: boolean = false;
  public hasPaidItems: boolean = false;
  public paidItems: PaidItems[] = [];
  public shops: ShopName[] = [];
  public selectedStore: string = null;
  public selectedDate: Date = null;
  public selectedAddress = null;
  public hasSelectedDelivery: boolean;
  public hasSelectedCollection: boolean;

  public newAddress: Address = {
    addressID: null,
    id: null,
    userAddress: null,
    addressNickName: null,
    isDefault: null
  }

  constructor(private addressService: AddressService,
    private loginService: LoginService,
    private homeHelper: HomeHelperService,
    private deliveriesHelper: DeliveriesHelper,
    private router: Router) { }

  ngOnInit(): void {
    const ConnectionPromise = new Promise(() => {
      window.addEventListener('online', () => { this.connected = true; });
      window.addEventListener('offline', () => { this.connected = false; });
    });

    const InitPromise = new Promise(() => {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.addresses.splice(0, this.addresses.length);
      this.hasSelectedCollection = false;
      this.hasSelectedDelivery = true;
    });

    const UserPromise = new Promise(() => {
      this.loginService.currentUser.subscribe((user: AuthRespData) => {
        user ? this.user = user : 
          this.user = {
            token: null,
            userId: null,
            userName: null,
            expiresIn: null,
            loggedIn: false,
            userRole: null,
            success: null
          };
        this.userEmail = sessionStorage.getItem('user_email') || null;
      });
    });

    const AddressesPromise = new Promise(() => {
      this.addressService.getAddresses(this.user.userId).subscribe((addresses: Address[]) => {
        addresses.length > 0 ? this.addresses.push(...addresses) : this.addresses = [];
      });
    });

    const PaidItemsPromise = new Promise(() => {
      this.paidItems.splice(0, this.paidItems.length);
      this.deliveriesHelper.getPaidItems(this.user.userId)
        .then((items: PaidItems[]) => {
          items.length > 0 ? this.hasPaidItems = true : this.hasPaidItems = false;
          this.paidItems.push(...items);
        }).catch(error => { throw new Error(error); });
    });

    const ShopsPromise = new Promise(() => {
      this.shops = this.deliveriesHelper.getShops();
    });

    const LoadingPromise = new Promise(() => {
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });

    async function CheckConnection() {
      await ConnectionPromise;
    }

    async function GetUser() {
      await UserPromise;
    }

    async function Init() {
      await InitPromise;
    }

    async function Addresses() {
      await AddressesPromise;
    }

    async function PaidItems() {
      await PaidItemsPromise;
    }

    async function GetShops() {
      await ShopsPromise;
    }

    async function StopLoading() {
      await LoadingPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      CheckConnection()
        .then(Init)
        .then(GetUser)
        .then(Addresses)
        .then(PaidItems)
        .then(GetShops)
        .then(StopLoading)
        .catch(err => { throw new Error(err); });
    } catch (error) {
      throw new Error(error);
    }
  }

  togglePane = (): void => {
    this.paneOpen = !this.paneOpen;
  }

  clearItems = (): void => {
    this.selectedStore = null;
    this.selectedAddress = null;
  }

  toggleType = (type: string = 'Delivery'): void => {
    switch (type) {
      case 'Collection':
          this.hasSelectedCollection = true;
          this.hasSelectedDelivery = false;
          this.clearItems();
          break;
      case 'Delivery':
          this.hasSelectedDelivery = true;
          this.hasSelectedCollection = false;
          this.clearItems();
          break;
      default: 
          console.log('Unknown Error');
          break;
    }
  }

  onSubmitAddress = (): void => {
    try {
      this.deliveriesHelper.submitAddress(this.newAddress, this.addressForm, this.user, this.addresses);
      this.clearItems();
      window.scrollTo(0, 0);
      this.paneOpen = false;
    } catch (error) {
      throw new Error(error);
    }
  }

  onDeleteAddress = (id: number, addressID: number): void => {
    try {
      this.deliveriesHelper.deleteAddress(id, addressID).then((success: boolean) => {
        if (success) {
          this.addresses.splice(0, this.addresses.length);
          this.addressService.getAddresses(this.user.userId).subscribe((addresses: Address[]) => {
            this.clearItems();
            this.addresses.push(...addresses);
          });
        }
        else {
          alert('Unable to Delete Address');
        }
      });
      this.paneOpen = false;
    } catch (error) {
      throw new Error(error);
    }
  }

  onSelectDate = (event: any): void => {
    this.deliveryDate = event.value;
    // this.deliveryDate = event.value.toLocaleDateString(); // Basic Date Format
    this.deliveryStringDate = event.value.toLocaleDateString('en-GB', this.options); // Custom Date Format
  }

  onSelectStore = (input: string): void => {
    this.selectedStore = input;
  }

  onSelectAddress = (input: string): void => {
    this.selectedAddress = input;
  }

  onCompleteTransaction = (): void => {
    try {
      if (confirm('Are you Sure?')) {
        window.scrollTo(0, 0);
        this.isLoading = true;
        this.deliveriesHelper.completeTransaction(this.hasSelectedDelivery, 
          this.hasSelectedCollection, this.user, this.userEmail, this.paidItems, 
          this.selectedAddress, this.selectedStore, this.deliveryDate);
        setTimeout(() => {
          this.isLoading = false;
          this.router.navigate(["/"]);
        }, 500);
      } else {
        return;
      }
    } catch (error) {
      throw new Error(error);
    }
  } 
}