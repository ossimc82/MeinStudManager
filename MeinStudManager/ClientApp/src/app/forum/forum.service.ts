import { Inject, Injectable } from "@angular/core";
import { ForumReply, ForumTopic, TopicCreatorInput } from "./forum-post.model";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";

@Injectable()
export class ForumService {
  endpoint: string = "api/Forum";
  constructor(private httpClient: HttpClient, @Inject('BASE_URL') private baseUrl: string,) { }
  httpHeader = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }
  getTopics(page: number): Observable<ForumTopic[]>{
    const params = new HttpParams()
    .set('begin', page)
    return this.httpClient.get<ForumTopic[]>(this.baseUrl + this.endpoint + "/list", {params: params})
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  setNewTopic(newTopic: TopicCreatorInput){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/new", newTopic)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  getAllTopicReplies(topicId: string){
    return this.httpClient.get<ForumReply[]>(this.baseUrl + this.endpoint + "/topic/" + topicId)
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
