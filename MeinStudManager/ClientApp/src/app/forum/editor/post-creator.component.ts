import { Component, Inject } from '@angular/core';
import { ForumCreatorInput } from '../forum-post.model';

import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-postEditor',
  templateUrl: './post-creator.html',
  styleUrls: ['./post-creator.component.css']
})
export class ForumTopicCreator {

  postData:ForumCreatorInput = {
    title: "",
    content: ""
  };

  constructor(
    public dialogRef: MatDialogRef<ForumCreatorInput>
  ) {}

  postDiscarded(){
    this.dialogRef.close()
  }
}
