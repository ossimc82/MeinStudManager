import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "./auth.service";

@Component({
  selector:'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});
  isLoading = false;
  error = false;
  errorMessage = '';
  loggedOut :boolean;
  loggedOutMessage = '';


  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm= new FormGroup({
      'ident' : new FormControl(null,Validators.required),
      'password' : new FormControl(null,[Validators.required])
    });
    if (this.authService.getWasLoggedOut) {
      this.loggedOut = this.authService.getWasLoggedOut();
      this.loggedOutMessage = 'your session has expired -please log in again'
    }
  }

  onSubmit() {
    const ident = this.loginForm.value.ident;
    const password = this.loginForm.value.password;
    this.isLoading = true;
    this.authService.login(ident,password).subscribe(
      resData => {
        this.isLoading = false;
        this.router.navigate(['']);
    }, errorRes => {
      this.error = true;
      this.errorMessage = 'Passwort oder Email nicht richtig!';
      this.isLoading = false;
    });

  }
  onRegister() {
    this.router.navigate(['register']);
  }

}
