import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { ForumTopic, ForumReply, ForumTopicResultsContainer, ForumReplyResultsContainer, ForumCreatorInput, EditorPurposeData, EditorPurposeTypes } from '../forum-post.model';
import { ForumPostCreator } from '../editor/post-creator.component';
import { ForumService } from '../forum.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { UserService } from 'src/app/shared/user/user.service';
import { ForumCustomDialog } from './customDialog/customDialog-component';
import { AuthResponse } from 'src/app/auth/auth.service';


@Component({
  selector: 'app-forum',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.css']
})
export class ForumTopicComponent implements OnInit {
  authorizedToDelete = false;
  postPageIterationNumbers: number[] = [];
  loadedReplyObj: ForumReplyResultsContainer = null;
  loadingPosts = false;
  userId = "";
  topicId = "";
  topicPageNum = 1;
  postPageNum = 1;
  constructor(public dialog: MatDialog, public forumService: ForumService, public userService: UserService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var topic = params.get('topicId');
      var pageNum = parseInt(params.get('pageNum'));
      var repliesPageNum = parseInt(params.get('replyPageNum'))
      if(topic){
        this.topicId = topic;
      }
      if(pageNum){
        this.topicPageNum = pageNum;
      }
      if(repliesPageNum){
        this.postPageNum = repliesPageNum;
      }
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    })
    this.userId = this.userService.getUserId()

    this.getServerRole()
  }
  currentReplies: ForumReply[] = [];
  REPLIES_PER_SITE: number = 20;

  createAnswer(answerType: string, referrencedReply?: ForumReply){
    var purpose: EditorPurposeData = { type: EditorPurposeTypes.newReply};
    if(answerType == "direct"){
      purpose.type = EditorPurposeTypes.directReply
      referrencedReply.title = this.decodeHtml(referrencedReply.title)
      referrencedReply.content = this.decodeHtml(referrencedReply.content)
      purpose.replyRef = referrencedReply;
    }
    const dialogRef = this.dialog.open(ForumPostCreator, {
      autoFocus: (answerType != "direct")
    }); //Open Pop-Up
    dialogRef.componentInstance.purposeData = purpose;

    dialogRef.afterClosed().subscribe(result => {
      if(result){ //Create Topic + First Post
        this.submitNewReply(<ForumCreatorInput>result);
      }
    });
  }

  editPost(post: ForumReply){
    post.title = this.decodeHtml(post.title)
    post.content = this.decodeHtml(post.content)
    var purpose: EditorPurposeData = {
      type: EditorPurposeTypes.replyEdit,
      replyRef: post
    };
    const dialogRef = this.dialog.open(ForumPostCreator);
    dialogRef.componentInstance.purposeData = purpose;

    dialogRef.afterClosed().subscribe(result => {
      if(result){//Create Topic + First Post
        this.submitEdit(<ForumCreatorInput>result, post);
      }
    });
  }

  deletePost(post: ForumReply){
    const dialogRef = this.dialog.open(ForumCustomDialog)
    dialogRef.afterClosed().subscribe(result => {
      if(result){
        this.deleteReply(post)
      }
    });
  }

  navigateBackToTopics(){
    this.router.navigate(['forum/' + this.topicPageNum]);
  }

  getUpVoteText(upvotes: number){
    return "&#128077 (" + upvotes + ")";
  }

  getDownVoteText(upvotes: number){
    return "&#128078 (" + upvotes + ")";
  }

  private decodeHtml(html: string) {
    var txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  }

  setPostsPageAmount(totalTopicAmout: number){ //Set Array of page numbers; to be looped in template
    this.postPageIterationNumbers = []
    for(var i = 1; i <= Math.ceil(totalTopicAmout / this.REPLIES_PER_SITE); i++){
      this.postPageIterationNumbers.push(i);
    }
  }

  goToPostPage(pageNum: number){
    this.postPageNum = pageNum;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['forum/' + this.topicPageNum + '/topic/' + this.topicId + '/' + this.postPageNum]));
  }

  getServerRole(){ //Sets this.authorizedToDelete according to role on the Server. Can delete only as Admin or Mod
    //get role from local storage
    var decrypted = JSON.parse(atob((<AuthResponse>JSON.parse(localStorage.getItem('userData'))).token.split('.')[1]));
    var datObj = decrypted["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]
    if(datObj){

      if(typeof datObj === 'string'){ //if string
        var role: string = <string>datObj;

        if(role == "Moderators" || role == "Administrators"){
          this.authorizedToDelete = true;
        }
      }
      else if (typeof datObj[Symbol.iterator] === 'function'){ //if iterable (Array)
        for(let roleobj of datObj){
          if(<string>roleobj == "Moderators" || <string>roleobj == "Administrators"){
            this.authorizedToDelete = true;
            break;
          }
        }
      }
    }
  }

  /* Service Communication Functions */

  getAllTopicReplies(topicId: string, postPageNumber: number){
    this.loadingPosts = true;
    this.forumService.getAllTopicReplies(topicId, postPageNumber).subscribe((res: {}) => {
      this.loadedReplyObj = <ForumReplyResultsContainer>res;
      this.currentReplies = this.loadedReplyObj.items;
      this.loadingPosts = false
      this.setPostsPageAmount(this.loadedReplyObj.totalCount);
      console.log("ALL REPLIES:", this.currentReplies)
    }, (error: any) => {
      this.loadingPosts = false
      //...
      }
    );
  }

  submitNewReply(reply: ForumCreatorInput){
    this.forumService.setNewReply(this.topicId, reply).subscribe((res: {}) => {
      this.goToPostPage(Math.ceil((this.loadedReplyObj.totalCount + 1) / this.REPLIES_PER_SITE))
    }, (error: any) => {
      //...
      }
    );
  }

  submitEdit(reply: ForumCreatorInput, post: ForumReply){
    this.forumService.editReply(reply, this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    }, (error: any) => {
      //...
      }
    );
  }

  deleteReply(post: ForumReply){
    this.forumService.deleteReply(this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    }, (error: any) => {
      //...
      }
    );
  }

  upVote(post: ForumReply){
    this.forumService.upVote(this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    }, (error: any) => {
      //...
      }
    );
  }

  downVote(post: ForumReply){
    this.forumService.downVote(this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    }, (error: any) => {
      //...
      }
    );
  }

  removeVote(post: ForumReply){
    this.forumService.removeVote(this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId, this.postPageNum)
    }, (error: any) => {
      //...
      }
    );
  }
}
