import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EditorPurposeData, EditorPurposeTypes, ForumCreatorInput, ForumReply } from '../forum-post.model';

import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForumCustomDialog } from '../topic/customDialog/customDialog-component';

@Component({
  selector: 'app-postEditor',
  templateUrl: './post-creator.html',
  styleUrls: ['./post-creator.component.css']
})
export class ForumPostCreator implements OnInit {

  TITLE_MIN_CHARACTERS: number = 3;
  TITLE_MAX_CHARACTERS: number = 128;
  MESSAGE_MIN_CHARACTERS: number = 3;
  MESSAGE_MAX_CHARACTERS: number = 2048;

  postData:ForumCreatorInput = {
    title: "",
    content: ""
  };
  headerText: string = "Neuen Beitrag Hizufügen"

  purposeData: EditorPurposeData = {type: EditorPurposeTypes.newTopic};

  constructor(
    public dialog: MatDialog,
    public dialogRef: MatDialogRef<ForumCreatorInput> //?
  ) {}

  ngOnInit(): void {
    console.log(this.purposeData)
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
    //Check if something has been changed
    if((this.postData.title == this.purposeData.replyRef?.title || this.postData.title.length == 0) &&
       (this.postData.content == this.purposeData.replyRef?.content || this.postData.content.length == 0)){
    this.dialogRef.close()
    }
    else{
      const dialogRef = this.dialog.open(ForumCustomDialog)
      dialogRef.componentInstance.text = "Eingabe Abbrechen? (Alle Änderungen gehen verloren)"
      dialogRef.afterClosed().subscribe(result => { //If Submitted new Topic
        if(result == true){
          this.dialogRef.close()
        }
      });
    }
  }

  postSubmitted(){
    var cantSubmit = false;
    var reason = "";
    if(this.postData.title.length < this.TITLE_MIN_CHARACTERS){
      cantSubmit = true;
      reason = "Fehler: Titel zu kurz. Mind. " + this.TITLE_MIN_CHARACTERS + " Character erforderlich."
    }
    else if(this.postData.title.length > this.TITLE_MAX_CHARACTERS){
      cantSubmit = true;
      reason = "Fehler: Titel zu lang. Max. " + this.TITLE_MAX_CHARACTERS + " Character sind erlaubt."
    }
    else if(this.postData.content.length < this.MESSAGE_MIN_CHARACTERS){
      cantSubmit = true;
      reason = "Fehler: Nachricht zu kurz. Mind. " + this.MESSAGE_MIN_CHARACTERS + " Character erforderlich."
    }
    else if(this.postData.content.length > this.MESSAGE_MAX_CHARACTERS){
      cantSubmit = true;
      reason = "Fehler: Nachricht zu lang. Max. " + this.MESSAGE_MAX_CHARACTERS + " Character sind erlaubt."
    }
    else if(this.postData.title == this.purposeData.replyRef?.title && this.postData.content == this.purposeData.replyRef?.content){
      cantSubmit = true;
      reason = "Es wurden keine Änderungen vorgenommen."
    }

    if(cantSubmit){
      const dialogRef = this.dialog.open(ForumCustomDialog)
      dialogRef.componentInstance.text = reason;
      dialogRef.componentInstance.onlyConfirm = true;
      dialogRef.componentInstance.confirmText = "Ok"
    }
    else{
      this.dialogRef.close(this.postData)
    }
  }
}
