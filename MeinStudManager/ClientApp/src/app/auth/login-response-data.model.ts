export class LoginResponse {

  constructor(public isAuthSuccessful: boolean,public errorMessage: string, private token :string) {}

  getToken(): string {
    return this.token;
  }
}
