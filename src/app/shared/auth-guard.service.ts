import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { LoginService } from '../auth/login/login.service';

@Injectable({providedIn: 'root'})
export class AuthGuardService implements CanActivate {

  constructor(public router: Router, public loginService: LoginService) {}

  canActivate(): boolean {
    const token = sessionStorage.getItem('access_token');
    const userRole = sessionStorage.getItem('user_role');
    const success = sessionStorage.getItem('success');

    if (token !== null && userRole === 'Admin' && success === 'true') {
      return true;
    } else {
      this.router.navigate(['/user-not-logged-in']);
      return false;
    }
  }
}
