import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { UserRegisterData } from '../user-register-data.model';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

registerForm: FormGroup = new FormGroup({});

  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'userName' : new FormControl(null,Validators.required),
      'firstName': new FormControl(null),
      'lastName': new FormControl(null),
      'email': new FormControl(null,[Validators.required, Validators.email]),
      'password': new FormControl(null,[Validators.required,Validators.minLength(6)]),
      'confirmPassword': new FormControl(null,[Validators.required])
    });
  }

  onSubmit() {

      const userData : UserRegisterData = {
        userName : this.registerForm.value.userName,
        firstName : this.registerForm.value.firstName,
        lastName : this.registerForm.value.lastName,
        email : this.registerForm.value.email,
        password : this.registerForm.value.password,
        confirmPassword : this.registerForm.value.confirmPassword
       }


    this.authService.signup(userData).subscribe(_ => {
      console.log("Successful registration");
    },
      error => {
      console.log(error.error.errors);
    });

  }


  onAbbort() {
    this.router.navigate(['login'])
  }






}
