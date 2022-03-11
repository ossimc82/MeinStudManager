import { HttpClient } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { map } from "rxjs/operators";
import { resGradesData, UniSubjectReq } from "./uni-subject.model";


@Injectable({
  providedIn:'root'
})
export class PerformanceRecordService {
  constructor(
    private http : HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {}


      getGrades()  {
       return this.http.get<resGradesData>(
         this.baseUrl + 'api/Grade').pipe(
           map(
             res =>  {
               console.log(res);
               return res.studySections;
             }
           )
         );
      }

      postGrade(grade : UniSubjectReq)  {
        return this.http.post(
          this.baseUrl + 'api/Grade', grade);
       }

      putGrade(grade : UniSubjectReq)  {
        return this.http.put(
          this.baseUrl + 'api/Grade', grade);
       }

       deleteGrade(grade : UniSubjectReq)  {
        return this.http.post(
          this.baseUrl + 'api/Grade/delete', grade);
       }


}

