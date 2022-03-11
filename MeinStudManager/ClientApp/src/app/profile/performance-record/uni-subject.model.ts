export interface resSubject {
  name : string;
  grade: number;
  credits: number;
}
export  interface resSubjects {
  name : string;
  subjects : resSubject[];
}
export interface resGradesData {
  studySections: resSubjects[];
}

// class for intern use
// is called UniSubject to avoid confusion with rxjs subject
export class UniSubject {
  constructor(
    public name: string,
    public grade: number,
    public cp: number
  ) {}
}
// class for outgoing API calls
export class UniSubjectReq {
  constructor(
    public studySection: string,
    public subject: string,
    public grade: number,
    public credits: number
  ) {}
}
