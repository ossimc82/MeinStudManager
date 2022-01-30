import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";

@Component({
  selector:'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({});

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loginForm= new FormGroup({
      'ident' : new FormControl(null,Validators.required),
      'password' : new FormControl(null,[Validators.required])
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
  }
  onRegister() {
    this.router.navigate(['register']);
  }

}
