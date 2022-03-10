import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { ForumTopic, ForumReply, ForumTopicResultsContainer, ForumReplyResultsContainer, ForumCreatorInput } from '../forum-post.model';
import { ForumTopicCreator } from '../editor/post-creator.component';
import { ForumService } from '../forum.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum-topic.component.html',
  styleUrls: ['./forum-topic.component.css']
})
export class ForumTopicComponent implements OnInit {

  topicId = "";
  pageNum = 1;

  constructor(public dialog: MatDialog, public forumService: ForumService, private router: Router, private route: ActivatedRoute) {}
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

  }
  currentTopics: ForumTopic[] = [];
  currentReplies: ForumReply[] = [];
  testData: ForumTopic[] = [
    {
      title: "Test",
      lastReply: ""
  //    content: "askdf;sdfjpsdjfosdfjdpfjsduohidfgyuhrojgkjfh0dfj84u3eh4tepfjre8o0tuwe9fjroehgrfidgnoifioerf80eu0v9234ur09uv300nu80nu83vnum08fvgnum34fgvnmhfvg4rhnm8fghm84vfghrfg8h4vgfhu834fvg8ruv8v4g8vgh8uvg4h8vgh484vgh8vg4hm8hh808h43h834h83v50gervg0um9-ervgikerfvgkerfvgkoervgkfm gk gerjmkoe rgjmk gerjm gerjmie rgmi erg gm erpj gjmerm gjermjg mje gmgmig. Danke fuers lesen!"
    },
    {
      title: "Tomatensosse",
      lastReply: ""
     // content: "Hey Leute, mir ist letztens der Topf vom Herd geflogen und jetzt hab ich keine Tomatensosse mehr. Kann mir vielleicht jemand welche leihen?"
    },
    {
      title: "WTF",
      lastReply: ""
  //    content: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ]

  createNewTopic(){
    const dialogRef = this.dialog.open(ForumTopicCreator); //Open Pop-Up

    dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
      if(!result){
        console.log("failure")
      }
      else{ //Create Topic + First Post
       // this.submitNewTopic(<TopicCreatorInput>result);
      }
    });
  }

  showTopic(topic: ForumTopic){
    this.router.navigate(['about']);
    this.getAllTopicReplies(topic.id)
  }

  createAnswer(){
    const dialogRef = this.dialog.open(ForumTopicCreator); //Open Pop-Up

    dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
      if(!result){
        console.log("failure")
      }
      else{ //Create Topic + First Post
        this.submitNewReply(<ForumCreatorInput>result);
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
}
