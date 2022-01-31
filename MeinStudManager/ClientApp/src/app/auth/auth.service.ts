import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { UserRegisterData } from "./user-register-data.model";



// add response interface
export interface RegistrationResponse {
  isSuccessfulRegistration: boolean;
  errros: string[];
}


@Injectable({
  providedIn:'root'
})
export class AuthService {

  constructor(private http: HttpClient) {}

  signup(userData: UserRegisterData) {
    return this.http.post<RegistrationResponse>(
      'https://localhost:7287/api/User/register',  // switch out for constant later
      userData
      );
  }
  login(ident :string, password: string) {
      return this.http.post('https://localhost:7287/api/User/login',
        {ident : ident,
         password: password
        });
  }

}
