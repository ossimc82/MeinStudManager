import { Component, Input, OnDestroy, OnInit } from '@angular/core';


@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css']
})
export class TodoListComponent implements OnInit, OnDestroy {

  @Input() methodName: string;
  newTask: string = "";
  tasks: string[] =[];

  constructor() { }

  ngOnDestroy(): void {
    if (this.tasks) {
      localStorage.setItem(this.methodName, JSON.stringify(this.tasks));
    }
  }

  ngOnInit(): void {
    if (JSON.parse(localStorage.getItem(this.methodName))) {
      this.tasks = JSON.parse(localStorage.getItem(this.methodName));
    } else {
      this.tasks = [];
    }


  }




  pushTask(){
    if (this.newTask.length > 50) {
      window.alert('zu viele Zeichen!');
      return;
    }
  	if (this.newTask != "") {
  		this.tasks.push(this.newTask);
		  this.newTask = "";
  	}
  }

  removeTask(i){
  	this.tasks.splice(i, 1);
  }

}
