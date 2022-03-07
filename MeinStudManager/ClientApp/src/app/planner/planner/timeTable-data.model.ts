
/* F */
export interface timeTableData {
  id?: string;
  subject: string;
  description?: string;
  dozent?: string;
  startTime: Date;
  endTime: Date;

  repetition?: string;
  repeatFrequency?: string;
  interval?: number;
  recurrenceRule?: string; //should replace other 3?

  disabledDates?: string[];

  color?: string;
  location?: string;
  category?: string;
}
