import { Injectable } from "@angular/core";

// maybe rename later to avoid confusion with rxjs subject
export class Subject {
  constructor(
    public type : string,
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
        "1",
        "Technische-Informatik",
        "2.3",
        "5"
      ),
      new Subject(
        "1",
        "BWL",
        "5.0",
        "5"
      ),
      new Subject(
        "2",
        "Mathe 1",
        "2.7",
        "5"
      ),
      new Subject(
        "2",
        "Mathe 2",
        "2.7",
        "5"
      ),
      new Subject(
        "3",
        "Rechnernetze",
        "2.7",
        "5"
      ),
      new Subject(
        "3",
        "Vertiefung Datenbanken",
        "2.7",
        "5"
      ),
      ]

      getSubjects() {
        return this.subjects;
      }

}
