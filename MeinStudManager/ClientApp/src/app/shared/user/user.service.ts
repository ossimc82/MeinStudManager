import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";
import { User } from "./user.model";




@Injectable({
  providedIn:'root'
})
export class UserService {

  user = new Subject<User>();

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string,
    private router: Router,
    private authService: AuthService) {}


  getUserId(): string {
    if (this.authService.loginStatus) {
      return this.authService.loginStatus.value.userId;
    }
    return null;
  }


  getUser() {
    return this.http.get<User>(
      this.baseUrl + 'api/Profile/' +this.getUserId()
    ).pipe(tap(
      res => {
        const user = new User(
          res.firstName,
          res.lastName,
          res.id,
          res.userName,
          res.email,
          res.emailConfirmed,
          res.phoneNumber,
          res.twoFactorEnabled
          );
      this.user.next(user);
      }
    ))
  }

  putUser(user: User) {
    return this.http.put(
      this.baseUrl + 'api/Profile/' +this.getUserId(), user
    );

  }

}







