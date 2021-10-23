import { Component, OnInit, Inject, Input } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LoginService } from 'src/app/auth/login/login.service';
import { ShoppingListService, UserShoppingList } from 'src/app/shared/shoppinglist.service';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';

interface dialogData {
  shoppingListName: string;
}

@Component({
  selector: 'app-list-dialog',
  templateUrl: './list-dialog.component.html',
  styleUrls: ['./list-dialog.component.css']
})

export class ListDialogComponent implements OnInit {
  @Input() listName: string;
  public listNames: UserShoppingList[] = [];
  public user: AuthRespData;

  constructor(private dialogRef: MatDialogRef<ListDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: dialogData,
    private loginService: LoginService,
    private shoppingListService: ShoppingListService) { }

  ngOnInit(): void {
    try {
      this.listNames.splice(0, this.listNames.length);
      this.loginService.currentUser.subscribe((data: AuthRespData) => { this.user = data; });
      this.shoppingListService.getUserShoppingList(this.user.userId).subscribe((data: UserShoppingList[]) => { this.listNames.push(...data); });
    } catch (error) {
      throw new Error(error);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
