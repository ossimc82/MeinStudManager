import { Component, Input, OnInit } from '@angular/core';
import { Method } from '../../method.model';

@Component({
  selector: 'app-method-details',
  templateUrl: './method-details.component.html',
  styleUrls: ['./method-details.component.css']
})
export class MethodDetailsComponent implements OnInit {

  @Input() method: Method;

  constructor() { }

  ngOnInit(): void {

  }

}
