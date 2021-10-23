import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RespData } from 'src/app/shared/models/responseData.model';
import { UserLocation } from 'src/app/shared/models/userlocation.model';
import { BehaviorSubject } from 'rxjs';
import { HomeHelperService } from 'src/app/home/homeHelper.service';

@Injectable({ providedIn: 'root' })
export class HeaderService {

  public address: string;
  public userLocation: UserLocation;
  public location = new EventEmitter<UserLocation>();
  public userLoc: UserLocation = null;
  public userDetails = new BehaviorSubject(this.userLoc);
  public currentLocation = this.userDetails.asObservable();

  updateUserLocation(user: UserLocation) {
    this.userDetails.next(user);
  }

  constructor(private http: HttpClient,
    private homeHelper: HomeHelperService) { }

  currentPositioning() {
    const promise = new Promise((resolve, reject) => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
          resolve([+position.coords.latitude, +position.coords.longitude]);
        });
      } else {
        reject(error => { throw new Error(error); });
      }
    });
    return promise;
  }

  getLocation() {
    try {
      if (!this.homeHelper.checkConnection()) { return; }
      this.currentPositioning()
        .then((location: any) => {
          let [lat, long] = location;
          this.http.get<RespData>(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=en`
          ).subscribe(data => {
            let str = data.locality;
            let town = str.split(" ", 1);
            this.userLocation = {
              Address: data.locality,
              Country: data.principalSubdivision,
              Town: town,
              Lat: data.latitude,
              Long: data.longitude
            }
            this.location.emit(this.userLocation);
            this.userDetails.next(this.userLocation);
          });
        }).catch(error => { throw new Error(error); });
    } catch (error) {
      throw new Error(error);
    }
  }

  changeLocation = (town: string) => {
    const promise = new Promise(resolve => {
      resolve(town);
    });
    return promise;
  }
}
