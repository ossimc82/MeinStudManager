import { Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { PerformanceRecordService, resGradesData, resSubject, resSubjects, UniSubject } from './performance-record.service';


@Component({
  selector: 'app-performance-record',
  templateUrl: './performance-record.component.html',
  styleUrls: ['./performance-record.component.css']
})
export class PerformanceRecordComponent implements OnInit, OnDestroy, DoCheck {

  subjects : UniSubject[] = [];
  subjectsSectionOne: UniSubject[] = [];
  subjectsSectionTwo: UniSubject[] = [];
  subjectsSectionOptional: UniSubject[] = [];

  sub: Subscription;

  subjectName: string = "";
  subjectGrade: string ="";
  subjectCP: string = "";
  subjectSection: string = "";
  showSubjectsSectionOne: boolean = false;
  showSubjectsSectionTwo: boolean = false;
  showSubjectsSectionOptional: boolean = false;
  editMode: boolean = false;

  averageGrade: string = '0';
  private count: number=0;
  private sum: number = 0;
  cpTotal: number = 0;

  addGradesVisible:  boolean;
  changeGradeVisible:  boolean;

  gradesForm: FormGroup;
  changeGradeForm: FormGroup;

  constructor(private subjectService : PerformanceRecordService) { }

  ngDoCheck(): void {
    if (this.sum !==0 && this.count !== 0) {
      this.averageGrade = (this.sum / this.count).toFixed(2);
    }
  }


  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    this.setUpForms()
    this.addGradesVisible = false;
    this.changeGradeVisible = true; // change after testing
    this.getGrades();
  }

  setShowSubjectsSectionOne() {
    this.showSubjectsSectionOne = !this.showSubjectsSectionOne;
  }
  setShowSubjectsSectionTwo() {
    this.showSubjectsSectionTwo = !this.showSubjectsSectionTwo;
  }
  setShowSubjectsSectionOptional() {
    this.showSubjectsSectionOptional = !this.showSubjectsSectionOptional;
  }

  getGrades() {

    this.sub = this.subjectService.getGrades().subscribe(
      res => {
        for (let i = 0; i < res.length; i++) {
          if (res[i].name === '1. Studienabschnitt') {
            for (let j =0; j < res[i].subjects.length; j++) {
              this.subjectsSectionOne.push(new UniSubject(
                res[i].subjects[j].name,
                res[i].subjects[j].grade,
                res[i].subjects[j].credits
              ));
              this.cpTotal = this.cpTotal + res[i].subjects[j].credits;
              this.count++;
              this.sum = this.sum + res[i].subjects[j].grade;
            }
          }
          if (res[i].name === '2. Studienabschnitt') {
            for (let j =0; j < res[i].subjects.length; j++) {
              this.subjectsSectionTwo.push(new UniSubject(
                res[i].subjects[j].name,
                res[i].subjects[j].grade,
                res[i].subjects[j].credits
              ));
              this.cpTotal = this.cpTotal + res[i].subjects[j].credits;
              this.count++;
              this.sum = this.sum + res[i].subjects[j].grade;
            }
          }
          if (res[i].name === 'Wahlpflichtfächer') {
            for (let j =0; j < res[i].subjects.length; j++) {
              this.subjectsSectionOptional.push(new UniSubject(
                res[i].subjects[j].name,
                res[i].subjects[j].grade,
                res[i].subjects[j].credits
              ));
              this.cpTotal = this.cpTotal + res[i].subjects[j].credits;
              this.count++;
              this.sum = this.sum + res[i].subjects[j].grade;
            }
          }
        }
      }
    );
  }
  setChangeGradesVisible() {
    this.addGradesVisible = !this.addGradesVisible;
  }

  setUpForms() {
    this.gradesForm = new FormGroup(
      {
        'subject' : new FormControl(null, Validators.required),
        'grade' : new FormControl(null, Validators.required),
        'creditPoints' : new FormControl(null ,Validators.required),
        'studySection' : new FormControl("subjectsSectionOne", Validators.required)
      }
    );
    this.changeGradeForm = new FormGroup({
      'grade' : new FormControl({value: '', disabled: true}, Validators.required)
    })

  }

  submitGrade() {
    console.log(this.gradesForm.value)
  }

  onEditSubject(subject : UniSubject, studySection : string) {
    this.changeGradeVisible=true;
    this.subjectName = subject.name;
    this.subjectGrade = subject.grade.toString();
    this.subjectCP = subject.cp.toString();
    this.subjectSection = studySection;
    this.changeGradeForm.patchValue({
      'grade' :  subject.grade
    });
  }

  onAbortEdit() {
    this.changeGradeVisible = false;
  }

  onChangeGrade(value : boolean) {
    this.editMode = value;
    if (this.editMode) {
      this.changeGradeForm.get('grade').enable();
    } else {
      // update logic here
      // always clear and fetch after update
      this.subjectGrade = this.changeGradeForm.get('grade').value;
      console.log(this.subjectName);
      console.log(this.subjectGrade);
      this.changeGradeForm.get('grade').disable();
    }

  }
  onDeleteGrade() {
    console.log(this.subjectName);
    // call service and delete here
  }

}
