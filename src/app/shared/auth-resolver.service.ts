import { Injectable } from '@angular/core';
import { AuthRespData } from '../auth/login/auth-resp-data.model';
import { LoginService } from '../auth/login/login.service';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthResolverService implements Resolve<AuthRespData> {

  constructor(private service: LoginService) { }
  public authResp: AuthRespData;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<AuthRespData> | Promise<AuthRespData> | AuthRespData {
    this.service.emittedUserDetails.subscribe(data => {
      this.authResp = data;
      if (this.authResp.loggedIn === false) {
        return;
      } else {
        return this.authResp;
      }
    });
    return this.authResp;
  }
}
