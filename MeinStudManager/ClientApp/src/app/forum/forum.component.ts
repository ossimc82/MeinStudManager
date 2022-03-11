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
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  loadingTopics:boolean = false;
  pageIterationNumbers: number[] = [];
  TOPICS_PER_SITE:number = 20;
  pageId = 1;

  constructor(public dialog: MatDialog, public forumService: ForumService, private router: Router, private route: ActivatedRoute) {}
  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      var pNum = parseInt(params.get('pageNum'));
      if(pNum){
      this.pageId = pNum;
      }
    })
    this.getAllTopicsFromPage(this.pageId)
  }

  loadedTopicObj: ForumTopicResultsContainer = null;
  currentTopics: ForumTopic[] = [];
  testData: ForumTopic[] = [
    {
      title: "Test",
      lastReply: ""
    },
    {
      title: "Tomatensosse",
      lastReply: ""    },
    {
      title: "WTF",
      lastReply: ""
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

  goToPage(pageNumber: number){
    this.pageId = pageNumber;
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(['forum/' + this.pageId]));

  }

  setPageAmount(totalTopicAmout: number){ //Set Array of page numbers; to be looped in template
    for(var i = 1; i <= Math.ceil(totalTopicAmout / this.TOPICS_PER_SITE); i++){
      this.pageIterationNumbers.push(i);
    }
  }

  goToTopicPage(topicAmount: number){

  }

/* Service Communication Functions */

  submitNewTopic(topicCreate: ForumCreatorInput){
    this.forumService.setNewTopic(topicCreate).subscribe((res: {}) => {
      //set to page where new Topic is located
      this.goToPage(Math.ceil((this.loadedTopicObj.totalCount + 1) / this.TOPICS_PER_SITE))
    }, (error: any) => {
      //...
      }
    );
  }

  getAllTopicsFromPage(page: number){
    this.loadingTopics = true;
    this.forumService.getTopics(page).subscribe((res: {}) => {
      this.loadedTopicObj = <ForumTopicResultsContainer>res;
      this.currentTopics = this.loadedTopicObj.items;
      this.loadingTopics = false;
      this.setPageAmount(this.loadedTopicObj.totalCount);
    }, (error: any) => {
      this.currentTopics = this.testData;
      this.loadingTopics = false;
      }
    );
  }
}
