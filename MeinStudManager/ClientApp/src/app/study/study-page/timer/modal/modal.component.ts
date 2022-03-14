import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MdbModalRef } from 'mdb-angular-ui-kit/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
})



export class ModalComponent implements OnInit {

  minutesForm: FormGroup;
  minutes: number = 25;

  constructor(public modalRef: MdbModalRef<ModalComponent>) {}

  ngOnInit(): void {
    this.minutesForm = new FormGroup({
      'minutes' : new FormControl(25, [Validators.maxLength(3)])
    })
  }

  onSaveChanges() {
    this.minutes = this.minutesForm.get('minutes').value;
    this.modalRef.close(this.minutes);
  }

  close(): void {
    this.modalRef.close();
  }

}
