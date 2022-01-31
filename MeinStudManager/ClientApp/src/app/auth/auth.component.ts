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

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    this.loginForm= new FormGroup({
      'ident' : new FormControl(null,Validators.required),
      'password' : new FormControl(null,[Validators.required])
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    const ident = this.loginForm.value.ident;
    const password = this.loginForm.value.password;
    this.authService.login(ident,password).subscribe(
      resData => {
        console.log(resData);
    }, error => {
      console.log(error);
    });

  }
  onRegister() {
    this.router.navigate(['register']);
  }

}
