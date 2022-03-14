import { Component, OnInit } from '@angular/core';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-stopwatch',
  templateUrl: './stopwatch.component.html',
  styleUrls: ['./stopwatch.component.css']
})
export class StopwatchComponent implements OnInit {


  m: number;
  s: number;

  running = false;
  value = [0, 0];
  subscription: Subscription;

  constructor() { }

  ngOnInit(): void {
    if (this.m) {
      this.value[0] = this.m;
    } else {
      this.m = 0;
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
      this.running = true;
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
     if ( this.value[1] === 59) {
        this.value = [this.value[0] + 1, 0];
      } else  {
        this.value = [this.value[0], this.value[1] + 1];
      }
    }
  }


}
