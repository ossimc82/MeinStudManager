import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, EventSettingsModel, EventRenderedArgs, ScheduleComponent, PopupOpenEventArgs, ActionEventArgs, actionBegin } from '@syncfusion/ej2-angular-schedule';
import { timeTableData } from './timeTable-data.model';
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox } from '@syncfusion/ej2-inputs'
import { PlannerService } from './planner.service'

@Component({
  selector: 'app-planner',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService],
  templateUrl: './planner.component.html'
})

export class PlannerComponent implements OnInit {
  constructor(public plannerService: PlannerService) { }

  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  public data: object[] = [];
  public eventSettings: EventSettingsModel = {};
  public testData: timeTableData[] = [
    {id: "0f8fad5b-d9cb-469f-a165-70867728950e",
      subject: 'Mathe 1',
      description: 'learn how to transponieren with GERD',
      location: "H0018",
      startTime: new Date(2022, 3, 16, 8, 15), //Month starts at 0
      endTime: new Date(2022, 3, 16, 9, 45),
      color: "#1111EE",
      dozent: "gerd",
      category: 'leisure'
    },
    {id: "0f8fad5b-d9cb-469f-a165-70867728950a",
      subject: 'GWT',
      description: 'Hardest Module u will ever visit',
      startTime: new Date(2022, 3, 16, 11, 45),
      endTime: new Date(2022, 3, 16, 13, 15),
      color: '#bb2222',
      recurrenceRule : 'FREQ=DAILY;INTERVAL=2;COUNT=8;',
      dozent: "brothuhn",
      category: 'vacation'
    },
    {id: "0f8fad5b-d9cb-469f-a165-70867728950b",
      subject: 'DBS V3',
      description: 'Datenbanksysteme DLC Content',
      startTime: new Date(2022, 3, 16, 14, 15),
      endTime: new Date(2022, 3, 16, 15, 45),
      color: '#00bb22'
    }
  ];
  categoryDropDown: DropDownList;
  lecturerTextBox: TextBox;


  ngOnInit(): void {
    this.eventSettings = {
      dataSource: this.data,
      fields: {
        id: 'id',
        subject: { name: 'subject'},
        description: { name: 'description' },
        startTime: { name: 'startTime' },
        endTime: { name: 'endTime' },
        recurrenceRule: { name: 'recurrenceRule'},

        location: { name: 'location' },
        isBlock: 'isBlock'
      }
    };
  }

  onEventRendered(args: EventRenderedArgs): void { //mostly to set color
    let color: string = args.data.color as string;
    if (!args.element || !color) {
        return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
        (args.element.firstChild as HTMLElement).style.borderLeftColor = color;
    } else {
        args.element.style.backgroundColor = color;
    }

//    let dozent: string = args.data.dozent as string;
//    if(dozent){
//      console.log(dozent)
//    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void { //Set custom Elements into the Event Configurator
    if (args.type === 'Editor') {
        // Create required custom elements in initial time
        if (!args.element.querySelector('.custom-ej2-category-lecturer-row')) { //if doesn't exist yet, generate
          let row: HTMLElement = createElement('div', { className: 'custom-ej2-category-lecturer-row' }); //Create row which will hold containers
          let formElement: HTMLElement = args.element.querySelector('.e-schedule-form');
          formElement.firstChild.insertBefore(row, args.element.querySelector('.e-start-end-row'));

          let container: HTMLElement = createElement('div', { className: 'e-subject-container' }); //Category
          let inputEle: HTMLInputElement = createElement('input', {
              className: 'e-field', attrs: { name: 'Category' }
          }) as HTMLInputElement;
          container.appendChild(inputEle);
          row.appendChild(container);
          this.categoryDropDown = new DropDownList({
              dataSource: [
                  { text: 'Vorlesung', value: 'lecture' },
                  { text: 'Übung', value: 'exercise' },
                  { text: 'Klausur', value: 'exam' },
                  { text: 'Lern-Meeting', value: 'meeting' },
                  { text: 'Freizeitaktivität', value: 'leisure' },
                  { text: 'Urlaub', value: 'vacation' },
                  { text: 'Sonstiges', value: 'else' },
              ],
              fields: { text: 'text', value: 'value' },

              floatLabelType: 'Always', placeholder: 'Kategorie'
          });
          this.categoryDropDown.appendTo(inputEle);

          let container2: HTMLElement = createElement('div', { className: 'e-location-container' }); //Lecturer
          let subContainer: HTMLElement = createElement('div', { className: 'e-float-input e-control-wrapper' });
          let titleElement: HTMLElement = createElement('label', { className: 'e-float-text e-label-top'})
          titleElement.innerText = "Dozent"
          let lecturerTextField: HTMLInputElement = createElement('input', {
            className: 'e-field', attrs: { name: 'Lecturer' }
          }) as HTMLInputElement;
          this.lecturerTextBox = new TextBox({

            floatLabelType: 'Always', placeholder: 'Dozent'
          });
          this.lecturerTextBox.appendTo(lecturerTextField);
          subContainer.appendChild(lecturerTextField)
          subContainer.appendChild(titleElement)
          container2.appendChild(subContainer)
          row.appendChild(container2)
        }

        if (args.element.querySelector('.custom-ej2-category-lecturer-row')){ //if a category-lecturer row exists, fill it with values

          if(args.data.dozent){
            this.lecturerTextBox.value = (<{ [key: string]: Object }>(args.data)).dozent as string;
          }
          else{
            this.lecturerTextBox.value = "";
          }

          if(!args.data.category || args.data.category == ""){
            this.categoryDropDown.value = "";
          }
          else{
            this.categoryDropDown.value = (<{ [key: string]: Object }>(args.data)).category as string;
          }
        }
    }
  }

  onActionBegin(args: ActionEventArgs): void { //When Data is added / changed, or Date has been changed
    if(args.requestType === 'eventCreate') { //event create
      this.createEvent(<timeTableData>args.addedRecords[0])
    }
    else if (args.requestType === 'eventChange') { //event update
      this.changeEvent(<timeTableData>args.changedRecords[0])
    }
    else if (args.requestType === 'eventRemove') { //event remove
      this.deleteEvent(<timeTableData>args.deletedRecords[0])
    }
    if(args.requestType === 'toolbarItemRendering'){ //initializing
      this.getEvents(true)
    }
  }

  onActionComplete(args: ActionEventArgs): void { //When changes are completed
    if(args.requestType === 'dateNavigate'){ //actualizing Data according to the selected Date
      this.getEvents()
    }
  }

  /** Calculates the proper Date-range that needs to be called (Winter or Summer Semester),
  and then fetches Data from the Server.*/
  getEvents(forceRequest: boolean = false){
    let now = new Date();
    let begin = new Date();
    let end = new Date();

    if(this.scheduleObj.getCurrentViewDates().length > 0){ //wenn noch kein Schedule vorhanden
      let currentViewDates: Date[] = this.scheduleObj.getCurrentViewDates() as Date[];
      now = currentViewDates[Math.round((currentViewDates.length - 1) / 2)] as Date; //middle of calender is seen as "now"
    }

    if(now.getMonth() > 2 && now.getMonth() < 9){ //Sommersemester
      begin.setMonth(2, 20)
      end.setMonth(9, 10)
    }
    else{ //Wintersemster
      begin.setMonth(8, 20)
      end.setMonth(3, 10)
      if(now.getMonth() >= 9 ){
        end.setFullYear(now.getFullYear() + 1)
      }
      else{
        begin.setFullYear(now.getFullYear() - 1)
        end.setFullYear(now.getFullYear())
      }
    }
    this.fetchEvents(begin, end, forceRequest);
  }

  previousStartDate: Date = new Date();

  fetchEvents(calendarStartDate: Date, calendarEndDate: Date, forceRequest: boolean){
    var compareStartDate = new Date(calendarStartDate)
    compareStartDate.setHours(0,0,0,0);
    if((this.previousStartDate.getTime() != compareStartDate.getTime()) || forceRequest){ //check if semester isnt loaded already (Or force request)
      this.previousStartDate = compareStartDate;
//    console.log("SENDING FROM: ", calendarStartDate)
//    console.log("SENDING TO: ", calendarEndDate)
      this.plannerService.getEvents(calendarStartDate, calendarEndDate).subscribe((res: timeTableData[]) => {
        this.scheduleObj.eventSettings.dataSource = res;
      }, (error: any) => {
        this.scheduleObj.eventSettings.dataSource = this.testData;
        }
      );
    }
  }

  createEvent(newEvent: timeTableData){
    this.plannerService.addEvent(newEvent).subscribe((res: timeTableData ) => {
      this.getEvents(true)
    }, (error: any) => {
      //...
      }
    );
  }

  changeEvent(changedEvent: timeTableData){
    this.plannerService.updateEvent(changedEvent).subscribe((res: {}) => {
      this.getEvents(true)
    }, (error: any) => {
      //...
      }
    );
  }

  deleteEvent(eventToDelete: timeTableData){
    this.plannerService.deleteEvent(eventToDelete.id).subscribe((res: {}) => {
      this.getEvents(true)
    }, (error: any) => {
      //...
      }
    );
  }
}
