import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { AuthRespData } from 'src/app/auth/login/auth-resp-data.model';
import { LoginService } from 'src/app/auth/login/login.service';

export interface User {
  firstName: string;
  surname: string;
  email: string;
  doj: Date;
  userRole: string;
  password: string;
  loggedIn: boolean
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {

  public users: User[];
  public user: AuthRespData;
  public isLoading = false;
  public displayedColumns: string[] = ['firstName', 'surname', 'email', 'doj', 'userRole', 'delete', 'edit'];
  public userRemoved: boolean;
  public dataSource: any;

  constructor(private userService: UserService, private router: Router, private loginService: LoginService) { }

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  ngOnInit() {
    try {
      window.scrollTo(0, 0);
      this.isLoading = true;
      this.userService.getUsers().subscribe((data: User[]) => {
        this.users = data;
        this.dataSource = new MatTableDataSource<User>(this.users);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
      });
      setTimeout(() => {
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onDeleteUser(email: string) {
    try {
      this.isLoading = true;
      this.loginService.currentUser.subscribe((data: AuthRespData) => {
        this.user = data;
      });
      if (window.confirm('Do you wish to delete this user?')) {
        this.userService.deleteUser(email, this.user.userId).subscribe((data: boolean) => {
          this.userRemoved = data;
          if (this.userRemoved === true) {
            this.users.splice(0, this.users.length);
            this.userService.getUsers().subscribe((data: User[]) => {
              this.users.push(...data);
              alert('User successfully removed');
              this.isLoading = false;
            });
          } else if (this.userRemoved === false) {
            alert('Unable to delete user');
            this.isLoading = false;
          }
        });
      } else {
        return this.isLoading = false;
      }
    } catch (error) {
      throw new Error(error);
    }
  }

  onEditUser(email: string) {
    try {
      const user: User = this.users.find((user) => {
        return user.email = email;
      });

      this.userService.emittedUser.emit(user);
      this.router.navigate(["/edit-users", email]);
    } catch (error) {
      throw new Error(error);
    }
  }

  scrollUpFunction() {
    window.scrollTo(0, 0);
  }
}