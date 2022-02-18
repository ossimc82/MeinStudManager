import { Inject, Injectable } from "@angular/core";
import { timeTableData } from "./timeTable-data.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";

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
  getEvents(semester: number): Observable<timeTableData[]>{
    const params = new HttpParams();
    params.set('semester', semester);
    return this.httpClient.get<timeTableData[]>(this.baseUrl + this.endpoint, {params: params})
  }
  addEvent(data: timeTableData): Observable<timeTableData>{
    return this.httpClient.post<timeTableData>(this.baseUrl + this.endpoint, data)
  }
  updateEvent(id: string, data: timeTableData): Observable<timeTableData>{
    const params = new HttpParams();
    params.set('id', id);
    return this.httpClient.put<timeTableData>(this.baseUrl + this.endpoint, data, {params: params})
  }
  deleteEvent(id: string){
    const params = new HttpParams();
    params.set('id', id);
    this.httpClient.delete(this.baseUrl + this.endpoint, {params: params})
  }
}
