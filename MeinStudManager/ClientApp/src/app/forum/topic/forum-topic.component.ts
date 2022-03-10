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

@Component({
  selector: 'app-forum',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.css']
})
export class ForumTopicComponent implements OnInit {
  userId = "";
  topicId = "";
  pageNum = 1;
  constructor(public dialog: MatDialog, public forumService: ForumService, public userService: UserService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var topic = params.get('topicId');
      var pageNum = parseInt(params.get('pageNum'));
      if(topic){
        this.topicId = topic;
        this.getAllTopicReplies(this.topicId)
      }
      if(pageNum){
        this.pageNum = pageNum;
      }
    })
    this.userId = this.userService.getUserId()
  }
  currentReplies: ForumReply[] = [];

  showTopic(topic: ForumTopic){
    this.router.navigate(['about']);
    this.getAllTopicReplies(topic.id)
  }

  createAnswer(answerType: string, referrencedReply?: ForumReply){
    var purpose: EditorPurposeData = { type: EditorPurposeTypes.newReply};
    if(answerType == "direct"){
      purpose.type = EditorPurposeTypes.directReply
      purpose.replyRef = referrencedReply;
    }
    const dialogRef = this.dialog.open(ForumPostCreator, {
      autoFocus: (answerType != "direct")
    }); //Open Pop-Up
    dialogRef.componentInstance.purposeData = purpose;

    dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
      if(!result){
        console.log("failure")
      }
      else{ //Create Topic + First Post
        this.submitNewReply(<ForumCreatorInput>result);
      }
    });
  }

  editPost(post: ForumReply){
    var purpose: EditorPurposeData = {
      type: EditorPurposeTypes.replyEdit,
      replyRef: post
    };
    const dialogRef = this.dialog.open(ForumPostCreator); //Open Pop-Up
    dialogRef.componentInstance.purposeData = purpose;

    dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
      if(!result){
        console.log("failure")
      }
      else{ //Create Topic + First Post
        this.submitEdit(<ForumCreatorInput>result, post);
      }
    });
  }

  navigateBackToTopics(){
    this.router.navigate(['forum/' + this.pageNum]);
  }


  /* Service Communication Functions */

  getAllTopicReplies(topicId: string){
    this.forumService.getAllTopicReplies(topicId).subscribe((res: {}) => {
      var resContainer = <ForumReplyResultsContainer>res;
      this.currentReplies = resContainer.items;
    }, (error: any) => {
      //...
      }
    );
  }

  submitNewReply(reply: ForumCreatorInput){
    this.forumService.setNewReply(this.topicId, reply).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId)
    }, (error: any) => {
      //...
      }
    );
  }

  submitEdit(reply: ForumCreatorInput, post: ForumReply){
    this.forumService.editReply(reply, this.topicId, post.id).subscribe((res: {}) => {
      this.getAllTopicReplies(this.topicId)
    }, (error: any) => {
      //...
      }
    );
  }
}
