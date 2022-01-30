import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

registerForm: FormGroup = new FormGroup({});

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.registerForm = new FormGroup({
      'username' : new FormControl(null,Validators.required),
      'firstname': new FormControl(null),
      'lastname': new FormControl(null),
      'email': new FormControl(null,[Validators.required, Validators.email]),
      'password': new FormControl(null,[Validators.required,Validators.minLength(6)]),
      'confirmed-password': new FormControl(null,[Validators.required])
    });
  }

  onSubmit() {
    console.log(this.registerForm.value);
  }
  onAbbort() {
    this.router.navigate(['login'])
  }






}
