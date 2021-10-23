import { Injectable } from '@angular/core';
import { UserLocation } from './models/userlocation.model';
import { HeaderService } from '../navigation/header/header.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Resolve } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LocationResolverService implements Resolve<any> {

  constructor(private service: HeaderService) { }
  public location: UserLocation;

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<UserLocation> | Promise<UserLocation> | UserLocation {
    this.service.getLocation();
    this.service.location.subscribe(data => { this.location = data; });

    return this.location;
  }
}
