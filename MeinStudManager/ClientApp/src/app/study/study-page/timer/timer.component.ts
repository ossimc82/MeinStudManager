import { Component, OnInit, OnDestroy } from '@angular/core';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import {  Subscription, interval } from 'rxjs';
import { ModalComponent } from './modal/modal.component';


@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.css']
})
export class TimerComponent implements OnInit, OnDestroy {

  modalRef: MdbModalRef<ModalComponent> | null = null;

  m: number;
  s: number;


  closeResult = '';

  running = false;
  value = [25, 0];
  subscription: Subscription;

  constructor(private modalService: MdbModalService) { }

  ngOnInit(): void {
    if (this.m) {
      this.value[0] = this.m;
    } else {
      this.m = 25;
    }
    if (this.s) {
      this.value[1] = this.s;
    } else {
      this.s = 0;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  startTimer(): void {
    if (!this.running) {
      // Set running to true.
      this.running = true;
      // Check if the timer is comeplete and if so reset it before starting.
      if (this.value[0] === 0 && this.value[1] === 0) {
        this.resetTimer();
      }
      // Create Rxjs interval to call a update method every second.
      this.subscription = interval(1000).subscribe(x => this.updateTimer());
    }
  }

  stopTimer(): void {
    if (this.running) {
      // Set running to false.
      this.running = false;
      // If we want to stop the timer then unsubscribe from the interval.
      if (this.subscription) {
        this.subscription.unsubscribe();
      }
    }
  }

  resetTimer(): void {
    // Set the minutes and seconds back to their original values.
    this.stopTimer();
    this.value = [this.m, this.s];
  }

  updateTimer(): void {
    if (this.running) {
      // Check if the timer is comeplete and if so stop the timer and run onComplete().
      if (this.value[0] === 0 && this.value[1] === 0) {
        this.stopTimer();
      } else if (this.value[0] !== 0 && this.value[1] === 0) {
        this.value = [this.value[0] - 1, 59];
      } else if (this.value[1] !== 0) {
        this.value = [this.value[0], this.value[1] - 1];
      }
    }
  }

  openModal() {
    this.modalRef = this.modalService.open(ModalComponent);
    this.modalRef.onClose.subscribe(res => {
      if (res > 0 ) {
       this.value[0] = res,
       this.m = res
       // errorhandling
      } else {
        this.value[0] = 25,
       this.m = 25
      }

    });
  }

}
