import { Injectable } from "@angular/core";

// maybe rename later to avoid confusion with rxjs subject
export class Subject {
  constructor(
    public name: string,
    public grade: string,
    public cp: string
  ) {}
}

@Injectable({
  providedIn:'root'
})
export class PerformanceRecordService {
  // hard coded test-data until API is available

    subjects: Subject[] = [
      new Subject(
        "Technische-Informatik",
        "2.3",
        "5"
      ),
      new Subject(
        "BWL",
        "5.0",
        "5"
      ),
      new Subject(
        "Mathe 1",
        "2.7",
        "5"
      ),
      ]

      getSubjects() {
        return this.subjects;
      }

}
