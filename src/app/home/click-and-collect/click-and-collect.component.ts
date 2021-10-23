import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { LoginService } from 'src/app/auth/login/login.service';
import { DeliveriesHelper, ShopName } from 'src/app/deliveries/deliveriesHelper.service';
import { CollectionItem, CollectionsService } from 'src/app/shared/collections.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-click-and-collect',
  templateUrl: './click-and-collect.component.html',
  styleUrls: ['./click-and-collect.component.css']
})
export class ClickAndCollectComponent implements OnInit {

  constructor(private collectionsService: CollectionsService,
    private loginService: LoginService,
    private deliveriesHelper: DeliveriesHelper) { }

  public isLoading: boolean = false;
  public collectionItems: CollectionItem[] = [];
  public user: AuthRespData;
  public userEmail: string;
  public shops: ShopName[] = [];
  public displayedColumns: string[] = ['title', 'brand', 'quantity', 'selectedShop', 'selectedCollectionDate', 'transactionDate'];
  public dataSource: any;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit(): void {
    this.isLoading = true;
    window.scrollTo(0, 0);
    
    const InitPromise = new Promise(() => {
      this.shops = this.deliveriesHelper.getShops();
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
      });
    });

    const CollectionItemsPromise = new Promise(() => {
      this.collectionsService.getAllCollections(this.user.userId).subscribe((_items: CollectionItem[]) => {
        if (_items) {
          this.collectionItems.splice(0, this.collectionItems.length);
          this.collectionItems.push(..._items);
        } else {
          this.collectionItems = [];
        }
      });
    });

    const MatTablePromise = new Promise(() => {
      this.dataSource = new MatTableDataSource<CollectionItem>(this.collectionItems);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    });

    async function Init() {
      await InitPromise;
    }

    async function GetUser() {
      await UserPromise;
    }

    async function GetItems() {
      await CollectionItemsPromise;
    }

    async function SetItems() {
      await MatTablePromise;
    }

    try {
      Init()
        .then(GetUser)
        .then(GetItems)
        .then(SetItems)
        .catch(err => { throw new Error(err); });
    } catch (error) {
      throw new Error(error);
    }
  }
}
