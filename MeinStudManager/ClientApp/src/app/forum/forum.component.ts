import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { ForumTopic, ForumReply, ForumTopicResultsContainer, TopicCreatorInput, ForumReplyResultsContainer } from './forum-post.model';
import { ForumTopicCreator } from './editor/post-creator.component';
import { ForumService } from './forum.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  constructor(public dialog: MatDialog, public forumService: ForumService) {}
  ngOnInit() {
    this.getAllTopicsFromPage(1)
  }
  currentTopics: ForumTopic[] = [];
  currentReplies: ForumReply[] = [];
  insideTopic = false;
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
        this.submitNewTopic(<TopicCreatorInput>result);
      }
    });
  }

  showTopic(topic: ForumTopic){
    this.getAllTopicReplies(topic.id)
  }

/* Service Communication Functions */

  submitNewTopic(topicCreate: TopicCreatorInput){
    this.forumService.setNewTopic(topicCreate).subscribe((res: {}) => {
      this.getAllTopicsFromPage(1)
    }, (error: any) => {
      //...
      }
    );
  }

  getAllTopicsFromPage(page: number){
    this.forumService.getTopics(page).subscribe((res: {}) => {
      var resContainer = <ForumTopicResultsContainer>res;
      console.log("Hey something is there: " , resContainer)
      this.currentTopics = resContainer.items;
    }, (error: any) => {
      this.currentTopics = this.testData;
      }
    );
  }

 /* Maybe with route? */

  createAnswer(){

  }

  submitReply(reply: ForumReply){

  }

  getAllTopicReplies(topicId: string){
    this.forumService.getAllTopicReplies(topicId).subscribe((res: {}) => {
      var resContainer = <ForumReplyResultsContainer>res;
      this.insideTopic = true;
      this.currentReplies = resContainer.items;
    }, (error: any) => {
      //...
      }
    );
  }

  navigateBackToTopics(){
    this.insideTopic = false;
  }
}
