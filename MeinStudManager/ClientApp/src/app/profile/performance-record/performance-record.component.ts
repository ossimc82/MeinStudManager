import { Component, OnInit } from '@angular/core';
import { PerformanceRecordService, Subject } from './performance-record.service';



@Component({
  selector: 'app-performance-record',
  templateUrl: './performance-record.component.html',
  styleUrls: ['./performance-record.component.css']
})
export class PerformanceRecordComponent implements OnInit {

  subjects : Subject[] = [];
  subjectName: string = "";
  subjectGrade: string ="";
  subjectCP: string = "";
  showSubjects: boolean = false;

  constructor(private subjectService : PerformanceRecordService) { }

  ngOnInit(): void {
    this.subjects = this.subjectService.getSubjects();
  }

  setShowSubjects() {
    this.showSubjects = !this.showSubjects;
  }

}
