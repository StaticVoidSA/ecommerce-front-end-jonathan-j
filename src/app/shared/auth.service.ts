import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { LoginService } from '../auth/login/login.service';

export interface AuthResponseData {
  token: string,
  success: boolean,
  expiresIn: string,
  userId: number,
  userName: string,
  userRole: string
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  public user: AuthRespData = {
    token: null,
    success: null,
    expiresIn: null,
    userId: null,
    userName: null,
    userRole: null,
    loggedIn: false
  }

  public userToken: string = "";
  private currentToken = new BehaviorSubject(this.userToken);
  public currentUserToken = this.currentToken.asObservable();

  constructor(private http: HttpClient, private loginService: LoginService) { }

  userTokenUpdate(token: string) {
    this.userToken = token;
  }

  signup(firstName: string, surname: string, email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/auth/signup',
      {
        firstName: firstName,
        surname: surname,
        email: email,
        password: password
      }
    )
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      'https://rnr-ecommerce-server-jj.herokuapp.com/api/auth/login',
      {
        email: email,
        password: password
      }
    ).pipe(tap(res => {
      sessionStorage.setItem('access_token', res.token);
      sessionStorage.setItem('success', String(res.success));
      sessionStorage.setItem('user_id', String(res.userId));
      sessionStorage.setItem('expires_in', res.expiresIn);
      sessionStorage.setItem('user_name', res.userName);
      sessionStorage.setItem('user_role', res.userRole);
    }));
  }

  logout() {
    this.user.token = null;
    this.user.userId = null;
    this.user.success = null;
    this.user.userName = null;
    this.user.userRole = null;
    this.user.expiresIn = null;
    this.user.loggedIn = false;
    this.userTokenUpdate(this.user.token);
    this.loginService.updateUserDetails(this.user);
    sessionStorage.setItem('success', this.user.success);
    sessionStorage.setItem('access_token', this.user.token);
    sessionStorage.setItem('user_name', this.user.userName);
    sessionStorage.setItem('user_role', this.user.userRole);
    sessionStorage.setItem('expires_in', this.user.expiresIn);
    sessionStorage.setItem('user_id', String(this.user.userId));
  }
}
