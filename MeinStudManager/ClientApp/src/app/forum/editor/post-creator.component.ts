import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { EditorPurposeData, EditorPurposeTypes, ForumCreatorInput, ForumReply } from '../forum-post.model';

import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-postEditor',
  templateUrl: './post-creator.html',
  styleUrls: ['./post-creator.component.css']
})
export class ForumPostCreator implements OnInit{

  postData:ForumCreatorInput = {
    title: "",
    content: ""
  };
  headerText: string = "Neuen Beitrag Hizufügen"

  purposeData: EditorPurposeData = {type: EditorPurposeTypes.newTopic};

  constructor(
    public dialogRef: MatDialogRef<ForumCreatorInput> //?
  ) {}

  ngOnInit(): void {
    //initialize Purpose
    if(this.purposeData.type == EditorPurposeTypes.newReply){
      this.headerText = "Antwort schreiben"
    }
    else if(this.purposeData.type == EditorPurposeTypes.directReply){
      this.headerText = "Direkt antwort an " + this.purposeData.replyRef.authorName
        + " zu " + this.purposeData.replyRef.title;
      this.postData.title = "Re: " + this.purposeData.replyRef.title;
    }
    else if(this.purposeData.type == EditorPurposeTypes.replyEdit){
      this.headerText = "Post bearbeiten";
      this.postData.title = this.purposeData.replyRef.title;
      this.postData.content = this.purposeData.replyRef.content;
    }
  }

  postDiscarded(){
    this.dialogRef.close()
  }
}
