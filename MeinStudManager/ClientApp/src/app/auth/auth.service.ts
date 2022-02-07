import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject } from "rxjs";
import { tap } from "rxjs/operators";
import { LoginResponse } from "./login-response-data.model";
import { UserRegisterData } from "./user-register-data.model";

export interface AuthResponse {
  isAuthSuccessful: boolean;
  errorMessage: string;
  token: string;
}

@Injectable({
  providedIn:'root'
})
export class AuthService {

  loginStatus = new BehaviorSubject<LoginResponse>(null);
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
    // sends an unauthorized back
    this.http.get(this.baseUrl + 'api/User/logout').subscribe();

    this.loginStatus.next(null);
    this.router.navigate(['login']);
    localStorage.clear();
  }

  autoLogin() {
    const userData : AuthResponse = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return;
    }
    console.log(userData);

    const loadedLoginStatus = new LoginResponse(userData.isAuthSuccessful,
                                                userData.errorMessage,
                                                userData.token);

    if (userData.token) {
      this.loginStatus.next(loadedLoginStatus);
    }
  }


  private handleAuth( resData: AuthResponse) {
    const isAuthSuccessful = resData.isAuthSuccessful;
    const errorMessage = resData.errorMessage;
    const token = resData.token;

    const loginStatus = new LoginResponse(
      isAuthSuccessful,
      errorMessage,
      token);
      this.loginStatus.next(loginStatus);
      localStorage.setItem('userData', JSON.stringify(loginStatus));
  }

}
