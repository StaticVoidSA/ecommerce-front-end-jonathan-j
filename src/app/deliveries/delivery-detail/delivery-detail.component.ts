import { Component, OnInit } from '@angular/core';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { LoginService } from 'src/app/auth/login/login.service';
import { HomeHelperService } from 'src/app/home/homeHelper.service';
import { Address, AddressService } from 'src/app/shared/address.service';

@Component({
  selector: 'app-delivery-detail',
  templateUrl: './delivery-detail.component.html',
  styleUrls: ['./delivery-detail.component.css']
})
export class DeliveryDetailComponent implements OnInit {

  public user: AuthRespData;
  public isLoading: boolean = false;
  public addresses: Address[] = [];
  public connected: boolean = false;

  constructor(private loginService: LoginService,
    private addressService: AddressService,
    private homeHelper: HomeHelperService) { }

  ngOnInit(): void {
    try {
      window.addEventListener('online', () => { this.connected = true; });
      window.addEventListener('offline', () => { this.connected = false; });

      this.connected = this.homeHelper.checkConnection();
      if (!this.connected) { return; }

      const InitPromise = new Promise(() => {
        this.isLoading == true;
        this.loginService.currentUser.subscribe((data: AuthRespData) => { this.user = data; });
        this.addressService.getAddresses(this.user.userId).subscribe(data => {
          this.addresses.splice(0, this.addresses.length);
          this.addresses.push(...data);
          setTimeout(() => {
            this.isLoading = false;
          }, 500);
        });
      });

      async function Init() {
        await InitPromise;
      }

      try {
        this.connected = this.homeHelper.checkConnection();
        if (!this.connected) { return; }
        Init();
      } catch (error) {
        throw new Error(error);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
