import { Component, OnInit } from '@angular/core';
import { PerformanceRecordService, Subject } from './performance-record.service';



@Component({
  selector: 'app-performance-record',
  templateUrl: './performance-record.component.html',
  styleUrls: ['./performance-record.component.css']
})
export class PerformanceRecordComponent implements OnInit {

  subjects : Subject[] = [];

  subjectsSectionOne: Subject[] = [];
  subjectsSectionTwo: Subject[] = [];
  subjectsOptional: Subject[] = [];

  subjectName: string = "";
  subjectGrade: string ="";
  subjectCP: string = "";
  showSubjectsSectionOne: boolean = false;
  showSubjectsSectionTwo: boolean = false;
  showSubjectsSectionOption: boolean = false;

  constructor(private subjectService : PerformanceRecordService) { }

  ngOnInit(): void {
    this.subjects = this.subjectService.getSubjects();

    // maybe filter here with rxjs map directly in the different arrays via switch case

    for (let i = 0; i < this.subjects.length; i++) {
      if (this.subjects[i].type === "1") {
        this.subjectsSectionOne.push(this.subjects[i]);
      }
      if (this.subjects[i].type === "2") {
        this.subjectsSectionTwo.push(this.subjects[i]);
      }
    }

  }

  setShowSubjectsSectionOne() {
    this.showSubjectsSectionOne = !this.showSubjectsSectionOne;
  }
  setShowSubjectsSectionTwo() {
    this.showSubjectsSectionTwo = !this.showSubjectsSectionTwo;
  }

}
