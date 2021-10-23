import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { HomeHelperService } from 'src/app/home/homeHelper.service';
import { Address } from 'src/app/shared/address.service';
import { DeliveriesHelper } from '../deliveriesHelper.service';

@Component({
  selector: 'app-edit-address',
  templateUrl: './edit-address.component.html',
  styleUrls: ['./edit-address.component.css']
})
export class EditAddressComponent implements OnInit {

  public address: Address = {
    id: null,
    addressID: null,
    addressNickName: null,
    userAddress: null,
    isDefault: null
  }

  public id: number;
  public addressID: number;
  public addressNickName: string;
  public userAddress: string;
  public isDefault: string;
  public username = sessionStorage.getItem('user_name') || null;
  public isLoading: boolean = false;
  public connected: boolean = false;

  constructor(private deliveriesHelper: DeliveriesHelper,
    private route: ActivatedRoute,
    private homeHelper: HomeHelperService) { }

  ngOnInit(): void {
    const ConnectionPromise = new Promise(() => {
      window.addEventListener('online', () => { this.connected = true; });
      window.addEventListener('offline', () => { this.connected = false; });
    });

    const InitPromise = new Promise(() => {
      this.isLoading = true;
      this.route.params.subscribe((data: Params) => {
        this.id = data['ID'];
        this.addressID = data['addressID'];
        this.addressNickName = data['addressNickName'];
        this.userAddress = data['userAddress'];
        this.isDefault = data['isDefault'];
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      });
    });

    async function CheckConnection() {
      await ConnectionPromise;
    }

    async function Init() {
      await InitPromise;
    }

    try {
      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }
      CheckConnection().then(Init);
    } catch (error) {
      throw new Error(error);
    }
  }

  onUpdate() {
    try {
      this.isLoading = true;
      this.deliveriesHelper.updateAddress(this.address, this.id, this.addressID,
        this.addressNickName, this.userAddress, this.isDefault);
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }
}
