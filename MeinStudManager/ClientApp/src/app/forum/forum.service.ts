import { Inject, Injectable } from "@angular/core";
import { ForumCreatorInput, ForumReply, ForumTopic } from "./forum-post.model";
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
    .set('page', page)
    return this.httpClient.get<ForumTopic[]>(this.baseUrl + this.endpoint + "/list", {params: params})
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  setNewTopic(newTopic: ForumCreatorInput){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/new", newTopic)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  getAllTopicReplies(topicId: string, page: number = 1){
    const params = new HttpParams()
    .set('page', page)
    return this.httpClient.get<ForumReply[]>(this.baseUrl + this.endpoint + "/topic/" + topicId, {params: params})
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  setNewReply(topicId: string, newReply: ForumCreatorInput){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/topic/" + topicId + "/new", newReply)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  editReply(reply: ForumCreatorInput, topicId: string, postId: string){
    return this.httpClient.put(this.baseUrl + this.endpoint + "/topic/" + topicId + "/edit/" + postId, reply)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  deleteReply(topicId: string, postId: string){
    return this.httpClient.delete(this.baseUrl + this.endpoint + "/topic/" + topicId + "/delete/" + postId)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  upVote(topicId: string, postId: string){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/topic/" + topicId + "/upVote/" + postId, null)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  downVote(topicId: string, postId: string){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/topic/" + topicId + "/downVote/" + postId, null)
    .pipe(
      retry(1),
      catchError(this.processError)
    )
  }

  removeVote(topicId: string, postId: string){
    return this.httpClient.post(this.baseUrl + this.endpoint + "/topic/" + topicId + "/removeVote/" + postId, null)
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
