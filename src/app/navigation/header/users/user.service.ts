import { Injectable, EventEmitter } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { User } from "./user.model";
import { UserUpdate } from "./edit-user/update-user.model";

export interface UserDetails {
  userid: Number;
  firstName: string;
  lastName: string;
  email: string;
  userRole: string;
  doj: Date;
}

@Injectable({ providedIn: "root" })
export class UserService {
  constructor(private http: HttpClient) {}

  emittedUser = new EventEmitter<User>();

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>("https://rnr-ecommerce-server-jj.herokuapp.com/api/admin/getUsers", {
      headers: {
        'Authorization': sessionStorage.getItem("access_token"),
        'User': sessionStorage.getItem("user_name"),
        'Role': sessionStorage.getItem("user_role"),
        'Access-Control-Allow-Origin' : '*'
      }
    });
  }

  getUser(email: string): Observable<User> {
    return this.http.post<User>(
      "https://rnr-ecommerce-server-jj.herokuapp.com/api/admin/getUser",
      {
        email: email,
      },
      {
        headers: {
          'Authorization': sessionStorage.getItem("access_token"),
          'User': sessionStorage.getItem("user_name"),
          'Role': sessionStorage.getItem("user_role"),
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }

  deleteUser(email: string, userID: number): Observable<boolean> {
    return this.http.post<boolean>(
      "https://rnr-ecommerce-server-jj.herokuapp.com/api/admin/deleteUser/",
      {
        email: email,
        userID: userID,
      },
      {
        headers: {
          'Authorization': sessionStorage.getItem("access_token"),
          'User': sessionStorage.getItem("user_name"),
          'Role': sessionStorage.getItem("user_role"),
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }

  editUser(user: UserUpdate): Observable<boolean> {
    return this.http.put<boolean>(
      "https://rnr-ecommerce-server-jj.herokuapp.com/api/admin/updateUser",
      {
        email: user.email,
        _email: user._email,
        firstName: user.firstName,
        surname: user.surname,
        userRole: user.userRole,
      },
      {
        headers: {
          'Authorization': sessionStorage.getItem("access_token"),
          'User': sessionStorage.getItem("user_name"),
          'Role': sessionStorage.getItem("user_role"),
          'Access-Control-Allow-Origin' : '*'
        }
      }
    );
  }
}
