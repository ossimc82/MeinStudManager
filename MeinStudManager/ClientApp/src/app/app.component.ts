import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(public router: Router,private authService: AuthService) {}

  ngOnInit(): void {
    // comment out to disable auto login
     this.authService.autoLogin();
  }
}
