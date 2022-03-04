import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";
import { tap } from "rxjs/operators";
import { LoginResponse } from "./login-response-data.model";
import { UserRegisterData } from "./user-register-data.model";

export interface AuthResponse {
  isAuthSuccessful: boolean;
  errorMessage: string;
  userId: string;
  token: string;
}

@Injectable({
  providedIn:'root'
})
export class AuthService {

  loginStatus = new BehaviorSubject<LoginResponse>(null);
  wasLoggedOut : boolean = false; // maybe invert all Logic here
  token: string='';


  constructor(private http: HttpClient,
              @Inject('BASE_URL') private baseUrl: string,
              private router: Router) {}

  signup(userData: UserRegisterData) {
    return this.http.post(
      this.baseUrl + 'api/User/register',
      userData
      )
  }

  login(ident :string, password: string) {
      return this.http.post<AuthResponse>(this.baseUrl + 'api/User/login',
        {
         ident : ident,
         password: password
        }
      ).pipe(tap(
        resData => {
          this.handleAuth(resData);
        }
      ));
  }


  logout() {
    this.http.get(this.baseUrl + 'api/User/logout').subscribe();

    this.loginStatus.next(null);
    this.router.navigate(['login']);
    localStorage.clear();
  }
  // logout method without a request, in case the token is already expired on the server
  autoLogout() {
    this.loginStatus.next(null);
    this.router.navigate(['login']);
    localStorage.clear();
    this.wasLoggedOut = true;
  }

  autoLogin() {
    const userData : AuthResponse = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    const loadedLoginStatus = new LoginResponse(userData.isAuthSuccessful,
                                                userData.errorMessage,
                                                userData.userId,
                                                userData.token);

    if (userData.token) {
      this.loginStatus.next(loadedLoginStatus);
    }
  }


  private handleAuth( resData: AuthResponse) {
    const isAuthSuccessful = resData.isAuthSuccessful;
    const errorMessage = resData.errorMessage;
    const userId = resData.userId;
    const token = resData.token;

    const loginStatus = new LoginResponse(
      isAuthSuccessful,
      errorMessage,
      userId,
      token);
      this.loginStatus.next(loginStatus);
      localStorage.setItem('userData', JSON.stringify(loginStatus));
  }

   setWasLoggedOut(bool : boolean) {
    this.wasLoggedOut = bool;
   }
  getWasLoggedOut() : boolean {
    return this.wasLoggedOut;
   }
}
