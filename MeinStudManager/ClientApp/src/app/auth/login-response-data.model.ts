export class LoginResponse {

  constructor(
    public isAuthSuccessful: boolean,
    public errorMessage: string,
    public userId: string,
    private token :string) {}

  getToken(): string {
    return this.token;
  }
}
