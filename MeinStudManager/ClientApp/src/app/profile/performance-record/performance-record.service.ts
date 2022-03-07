import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { pipe, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";

export interface resSubject {
  name : string;
  grade: number;
  credits: number;
}
export  interface resSubjects {
  name : string;
  subjects : resSubject[];
}
export interface resGradesData {
  studySections: resSubjects[];
}

export class UniSubject {
  constructor(
    public name: string,
    public grade: number,
    public cp: number
  ) {}
}

@Injectable({
  providedIn:'root'
})
export class PerformanceRecordService {
  constructor(
    private http : HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {}


      getGrades()  {
       return this.http.get<resGradesData>(
         this.baseUrl + 'api/Grade/list').pipe(
           map(
             res =>  {
               return res.studySections;
             }
           )
         );
      }
}

