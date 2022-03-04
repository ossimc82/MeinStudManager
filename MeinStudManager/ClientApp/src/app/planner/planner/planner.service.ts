import { Inject, Injectable } from "@angular/core";
import { timeTableData } from "./timeTable-data.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

//GET: Semester Senden als parameter
//POST: nur Data senden (body)
//DELETE: nur GUID senden
//PUT: GUID parameter, Data im body

@Injectable()
export class PlannerService {
  endpoint: string = "api/timetable";
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getEvents(beginDate: Date, endDate: Date): Observable<timeTableData[]>{
    const params = new HttpParams();
    params.set('begin', JSON.stringify(beginDate));
    params.set('end', JSON.stringify(endDate));
    return this.httpClient.get<timeTableData[]>(this.baseUrl + this.endpoint, {params: params})
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }
  addEvent(data: timeTableData): Observable<any>{
    return this.httpClient.post<timeTableData>(this.baseUrl + this.endpoint, data)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }
  updateEvent(data: timeTableData): Observable<any>{
    return this.httpClient.put<timeTableData>(this.baseUrl + this.endpoint + "/" + data.id, data)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }
  deleteEvent(id: string): Observable<any>{
    return this.httpClient.delete(this.baseUrl + this.endpoint + "/" + id)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  processError(err) {
    let message = '';
    if(err.error instanceof ErrorEvent) {
     message = err.error.message;
    } else {
     message = `Error Code: ${err.status}\nMessage: ${err.message}`;
    }
    console.log(message);
    console.log(err)
    return throwError(message);
 }
}
