import { Component, DoCheck, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {  pipe, Subscription } from 'rxjs';
import { PerformanceRecordService } from './performance-record.service';
import { UniSubject, UniSubjectReq } from './uni-subject.model';


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

  errorPR: boolean;
  errorPRchangeGrade: boolean;

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
    this.changeGradeVisible = false;
    this.errorPR = false;
    this. errorPRchangeGrade = false;
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
          if (res[i].name === 'Wahlpflichtfach') {
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

  resetGrades() {
    this.subjectsSectionOne = [];
    this.subjectsSectionTwo = [];
    this.subjectsSectionOptional = [];
    this.sum = 0;
    this.count =0;
    this.averageGrade='';
    this.cpTotal=0;
  }

  setAddGradesVisible() {
    this.addGradesVisible = !this.addGradesVisible;
    this.onAbortEdit();
  }

  setUpForms() {
    this.gradesForm = new FormGroup(
      {
        'subject' : new FormControl(null, [Validators.required, Validators.minLength(5)]),
        'grade' : new FormControl(null, [Validators.required,Validators.pattern(/[+]?([1-5]*[\,\.]{1}[0-9]+|[0-5])/), Validators.maxLength(3)]),
        'creditPoints' : new FormControl(null ,[Validators.required, Validators.pattern(/^-?(0|[3-9]\d*)?$/), Validators.maxLength(1)]),
        'studySection' : new FormControl("1. Studienabschnitt", Validators.required)
      }
    );
    this.changeGradeForm = new FormGroup({
      'grade' : new FormControl({value: '', disabled: true}, [Validators.required,Validators.pattern(/[+]?([1-5]*[\,\.]{1}[0-9]+|[0-5])/), Validators.maxLength(3)])
    })

  }

  submitGrade() {

    this.subjectService.postGrade(new UniSubjectReq(
      this.gradesForm.get('studySection').value,
      this.gradesForm.get('subject').value,
      this.gradesForm.get('grade').value.replaceAll(',', '.'),
      this.gradesForm.get('creditPoints').value,
    )).subscribe(
      res => {
        this.resetGrades();
        this.getGrades();
        this.addGradesVisible= false;
        this.errorPR = false;
      },
      errorRes => {
        this.errorPR = true;
      }
    );

  }

  onEditSubject(subject : UniSubject, studySection : string) {
    this.addGradesVisible = false;
    this.changeGradeVisible=true;
    this.subjectName = subject.name;
    this.subjectGrade = subject.grade.toString();
    this.subjectCP = subject.cp.toString();
    this.subjectSection = studySection;
    this.changeGradeForm.patchValue({
      'grade' :  subject.grade.toString()
    });

  }

  onAbortEdit() {
    this.changeGradeVisible = false;
  }


  onChangeGrade() {
    this.editMode = true;
    this.changeGradeForm.get('grade').enable();

  }

  onSaveChangedGrade() {

    this.editMode = false;

    this.subjectGrade = this.changeGradeForm.get('grade').value.replaceAll(',', '.');
    this.changeGradeForm.get('grade').disable();
    this.subjectService.putGrade(new UniSubjectReq(
    this.subjectSection,
    this.subjectName,
    +(this.subjectGrade),
    +this.subjectCP
  )).subscribe(
    res => {
      this.resetGrades();
      this.getGrades();
      this.changeGradeVisible = false;
      this.errorPRchangeGrade = false;
    },
    errorRes => {
      this.errorPRchangeGrade = true;
    }
  );
  }

  onDeleteGrade() {
    this.subjectService.deleteGrade(new UniSubjectReq(
      this.subjectSection,
      this.subjectName,
      +this.subjectGrade,
      +this.subjectCP,
    )).subscribe( res => {

      this.resetGrades();
      this.getGrades();
      this.errorPR = false;
    },
    errorRes => {
      this.errorPR = true;
    });
    this.showSubjectsSectionOne= false;
    this.showSubjectsSectionTwo= false;
    this.showSubjectsSectionOptional = false;
    this.resetGrades();
    this.getGrades();
    this.onAbortEdit();
  }


}
