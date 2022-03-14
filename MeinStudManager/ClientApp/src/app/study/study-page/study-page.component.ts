import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/shared/user/user.model';
import { UserService } from 'src/app/shared/user/user.service';
import { Method } from '../method.model';
import { StudyService } from '../study.service';

@Component({
  selector: 'app-study-page',
  templateUrl: './study-page.component.html',
  styleUrls: ['./study-page.component.css']
})
export class StudyPageComponent implements OnInit {

  methods: Method[];
  method : Method;
  user: Observable<User>

  constructor(
    private userService:UserService,
    private studyService: StudyService) { }

  ngOnInit(): void {
   this.user = this.userService.getUser();
   this.methods = this.studyService.getMethods();
   // starts with pomodoro
   this.method = this.methods[0];
  }

  getSelectedMethod(method : Method) {
    this.method = method;
  }

}
