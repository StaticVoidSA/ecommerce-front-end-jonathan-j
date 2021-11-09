import { Component, OnInit } from '@angular/core';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { LoginService } from 'src/app/auth/login/login.service';
import { DeliveriesService, DeliveryItem } from 'src/app/shared/deliveries.service';

@Component({
  selector: 'app-track-my-order',
  templateUrl: './track-my-order.component.html',
  styleUrls: ['./track-my-order.component.css']
})
export class TrackMyOrderComponent implements OnInit {

  constructor(private itemsService: DeliveriesService, private userService: LoginService) { }

  isLoading: boolean = false;
  items: DeliveryItem[] = [];
  user: AuthRespData;

  ngOnInit(): void {

    const UserPromise = new Promise(() => {
      this.isLoading = true;
      this.userService.currentUser.subscribe((_user: AuthRespData) => {
        _user.loggedIn === true && _user.userRole === 'Admin' || _user.userRole === 'User'
          ? this.user = _user 
          : this.user = null;
      });
    });
    
    const PaidItemsPromise = new Promise(() => {
      this.itemsService.getAllDeliveries(this.user.userId).subscribe((_items: DeliveryItem[]) => {
        (_items.length > 0)
          ? this.items.push(..._items)
          : this.items = null;
      });
    });

    async function User() {
      await UserPromise;
    }

    async function Items() {
      await PaidItemsPromise;
    }

    User().then(Items);
    console.log(this.items);

    setTimeout(() => {
      this.isLoading = false;
    }, 500);
  }

}
