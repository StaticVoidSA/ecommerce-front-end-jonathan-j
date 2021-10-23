import { Injectable, EventEmitter } from '@angular/core';
import { AuthRespData } from './auth-resp-data.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({providedIn: 'root'})
export class LoginService {
  emittedUserDetails = new EventEmitter<AuthRespData>();

  public user: AuthRespData = {
    token: null,
    success: null,
    expiresIn: null,
    userId: null,
    userName: null,
    userRole: null,
    loggedIn: false
  };

  private userDetails = new BehaviorSubject(this.user);
  currentUser = this.userDetails.asObservable();

  updateUserDetails(user: AuthRespData) {
    this.userDetails.next(user);
  }
}
