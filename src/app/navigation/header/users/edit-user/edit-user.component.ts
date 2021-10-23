import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../user.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

interface User {
  firstName: string;
  surname: string;
  email: string;
  doj: Date;
  userRole: string;
  password: string;
  loggedIn: boolean
}

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  constructor(private service: UserService, private route: ActivatedRoute, private router: Router) { }
  public user: User;
  public updated: boolean = false;
  public isLoading: boolean = false;
  @ViewChild('userForm') userForm: NgForm;

  updatedUser = {
    firstName: null,
    surname: null,
    email: null,
    _email: null,
    doj: null,
    userRole: null
  };

  ngOnInit(): void {
    try {
      this.isLoading = true;
      setTimeout(() => {
        this.route.params.subscribe((params: Params) => {
          this.service.getUser(params.email).subscribe(data => {
            this.user = data;
          });
        });
        this.isLoading = false;
      }, 500);
    } catch (error) {
      throw new Error(error);
    }
  }

  onSubmit() {
    try {
      this.updatedUser.firstName = this.userForm.value.userData.firstName;
      this.updatedUser.surname = this.userForm.value.userData.surname;
      this.updatedUser.email = this.userForm.value.userData.email;
      this.updatedUser._email = this.user.email;
      this.updatedUser.doj = this.userForm.value.userData.doj;
      this.updatedUser.userRole = this.userForm.value.userData.userRole;

      let edit = confirm('Are you sure you want to update this user?')
      if (edit) {
        this.service.editUser(this.updatedUser).subscribe(data => {
          this.updated = data;
          if (this.updated) {
            alert(`User ${this.user.firstName} successfully updated.`);
            return this.router.navigate(["/users"]);
          } else {
            alert(`Unable to update ${this.user.firstName}.`);
            return this.router.navigate(["/users"]);
          }
        });
      } else {
        this.router.navigate(["/users"]);
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}
