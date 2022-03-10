import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';

import { MatDialog } from '@angular/material/dialog';
import { MatButton } from '@angular/material/button';

import { ForumTopic, ForumReply, ForumTopicResultsContainer, ForumReplyResultsContainer, ForumCreatorInput, EditorPurposeData, EditorPurposeTypes } from './forum-post.model';
import { ForumPostCreator } from './editor/post-creator.component';
import { ForumService } from './forum.service';

import { Router, ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})
export class ForumComponent implements OnInit {

  pageId = 1;

  constructor(public dialog: MatDialog, public forumService: ForumService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var pNum = parseInt(params.get('pageNum'));
      if(pNum){
      this.pageId = pNum;
      }
    })
    console.log("We load page " , this.pageId)
    this.getAllTopicsFromPage(this.pageId)
  }
  currentTopics: ForumTopic[] = [];
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
    const dialogRef = this.dialog.open(ForumPostCreator); //Open Pop-Up
    var purpose: EditorPurposeData = { type: EditorPurposeTypes.newTopic }
    dialogRef.componentInstance.purposeData = purpose;

    dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
      if(!result){
        console.log("failure")
      }
      else{ //Create Topic + First Post
        this.submitNewTopic(<ForumCreatorInput>result);
      }
    });
  }

  showTopic(topic: ForumTopic){
    this.router.navigate(['forum/' + this.pageId + "/topic/" + topic.id]);
  }

/* Service Communication Functions */

  submitNewTopic(topicCreate: ForumCreatorInput){
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
      this.currentTopics = resContainer.items;
    }, (error: any) => {
      this.currentTopics = this.testData;
      }
    );
  }
}
