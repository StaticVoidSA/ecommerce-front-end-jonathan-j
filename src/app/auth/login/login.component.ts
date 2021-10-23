import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AuthenticationService, AuthResponseData } from 'src/app/shared/auth.service';
import { LoginService } from './login.service';
import { AuthRespData } from './auth-resp-data.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit {

  public isLoading: boolean = false;

  private authResponse: AuthRespData = {
    userRole: null,
    expiresIn: null,
    loggedIn: false,
    token: null,
    userId: null,
    userName: null,
    success: null
  };

  private user = {
    email: null,
    password: null
  }

  constructor(private router: Router,
    private authService: AuthenticationService,
    private loginService: LoginService) { }

  ngOnInit() {
    window.scrollTo(0, 0);
  }

  onHomeNav() {
    this.router.navigate(['/']);
  }

  onSignupNav() {
    this.router.navigate(['/signup']);
  }

  onNavForgetPassword() {
    this.router.navigate(['/forgetpassword']);
  }

  gatherFormData(form: NgForm): any {
    const promise = new Promise((resolve, reject) => {
      if (!form.valid) { reject(`Invalid Form ${form}`); }
      this.isLoading = true;
      this.user.email = form.value.email;
      this.user.password = form.value.password;
      resolve(this.user);
    });
    return promise;
  }

  setData(data) {
    this.authResponse.userRole = data.userRole;
    this.authResponse.expiresIn = data.expiresIn;
    this.authResponse.loggedIn = data.success;
    this.authResponse.token = data.token;
    this.authResponse.userName = data.userName;
    this.authResponse.userId = data.userId;
  }

  setSessionStorage(data: AuthResponseData, userEmail: string) {
    sessionStorage.setItem('access_token', data.token);
    sessionStorage.setItem('user_role', data.userRole);
    sessionStorage.setItem('user_name', data.userName);
    sessionStorage.setItem('expires_in', data.expiresIn);
    sessionStorage.setItem('success', String(data.success));
    sessionStorage.setItem('user_id', String(data.userId));
    sessionStorage.setItem('user_email', userEmail);
  }

  onLogin(form: NgForm) {
    this.gatherFormData(form)
      .then((data: any) => {
        this.authService.login(data.email, data.password).subscribe((user) => {
          if (user.success === true && user.userRole === 'Admin' || user.userRole === 'User') {
            setTimeout(() => {
              this.setData(user);
              this.setSessionStorage(user, data.email);
              this.loginService.emittedUserDetails.emit(this.authResponse);
              this.loginService.updateUserDetails(this.authResponse);
              this.authService.userTokenUpdate(this.authResponse.token);
              this.isLoading = false;
              this.router.navigate(["/"]);
            }, 500);
          } else if (user.success === false) {
            setTimeout(() => {
              this.isLoading = false;
              alert("Invalid username/password");
              return;
            }, 500);
          }
        });
      }).catch(error => { throw new Error(error); });
  }
}
