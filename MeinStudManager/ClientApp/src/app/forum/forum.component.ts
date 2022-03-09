import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './forum.component.html',
})
export class ForumComponent implements OnInit {

  today = Date.now();

  constructor() {}

  ngOnInit() {
  }
}
