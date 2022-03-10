import { Component, Inject } from '@angular/core';

import { MatButton } from '@angular/material/button';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ForumCreatorInput } from '../../forum-post.model';

@Component({
  selector: 'app-postEditor',
  templateUrl: './custom-dialog.html',
  styleUrls: ['./customDialog.component.css']
})
export class ForumCustomDialog{

  text: string = "Wollen sie den Post wirklich löschen?";
  onlyConfirm: boolean = false;
  confirmText: string = "Ja";

  constructor(
    public dialogRef: MatDialogRef<ForumCreatorInput>
  ) {}
}
