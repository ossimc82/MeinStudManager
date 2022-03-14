import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { Method } from '../../method.model';

@Component({
  selector: 'app-method',
  templateUrl: './method.component.html',
  styleUrls: ['./method.component.css']
})
export class MethodComponent implements OnInit {

 @Input() method: Method;
 @Output() methodEvent = new EventEmitter<Method>();
  constructor() { }

  ngOnInit(): void {
  }



  onShowMethod() {
    this.methodEvent.emit(this.method);
  }

}
