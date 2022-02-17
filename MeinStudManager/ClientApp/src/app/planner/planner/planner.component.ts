import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, EventSettingsModel, EventRenderedArgs, ScheduleComponent, PopupOpenEventArgs } from '@syncfusion/ej2-angular-schedule';
import { timeTableData } from './timeTable-data.model';
import { createElement } from '@syncfusion/ej2-base';
import { DropDownList } from '@syncfusion/ej2-dropdowns';
import { TextBox, TextBoxModel } from '@syncfusion/ej2-inputs'

@Component({
  selector: 'app-planner',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService],
  templateUrl: './planner.component.html'
})

export class PlannerComponent implements OnInit {
  constructor() { }

  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;
  public data: object[] = [];
  public eventSettings: EventSettingsModel = {};
  public testData: timeTableData[] = [
    {id: "0f8fad5b-d9cb-469f-a165-70867728950e",
      subject: 'Mathe 1',
      description: 'learn how to transponieren with GERD',
      location: "H0018",
      startTime: new Date(2022, 1, 16, 10, 0), //Month starts at 0
      endTime: new Date(2022, 1, 16, 11, 30),
      color: "#1111EE",
      dozent: "gerd",
      category: 'leisure'
    },
    {id: "0f8fad5b-d9cb-469f-a165-70867728950a",
      subject: 'GWT',
      description: 'Hardest Module u will ever visit',
      startTime: new Date(2022, 1, 16, 11, 45),
      endTime: new Date(2022, 1, 16, 13, 15),
      color: '#bb2222',
      recurrenceRule : 'FREQ=DAILY;INTERVAL=2;COUNT=8;',
      dozent: "brothuhn",
      category: 'vacation'
    },
    {id: "0f8fad5b-d9cb-469f-a165-70867728950b",
      subject: 'DBS V3',
      description: 'Datenbanksysteme DLC Content',
      startTime: new Date(2022, 1, 16, 14, 15),
      endTime: new Date(2022, 1, 16, 15, 45),
      color: '#00bb22'
    }
  ];
  categoryDropDown: DropDownList;
  lecturerTextBox: TextBox;


  ngOnInit(): void {
    this.data = this.testData;
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

  onEventRendered(args: EventRenderedArgs): void {
    let color: string = args.data.color as string;
    if (!args.element || !color) {
        return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
        (args.element.firstChild as HTMLElement).style.borderLeftColor = color;
    } else {
        args.element.style.backgroundColor = color;
    }

    let dozent: string = args.data.dozent as string;
    if(dozent){
      console.log(dozent)

    }
  }

  onPopupOpen(args: PopupOpenEventArgs): void {
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

        if (args.element.querySelector('.custom-ej2-category-lecturer-row')){ //if already exists (also right after generation), fill values

          console.log("Set data", args.data)

          if(args.data.dozent){
            this.lecturerTextBox.value = (<{ [key: string]: Object }>(args.data)).dozent as string;
          }
          else{
            this.lecturerTextBox.value = "test";
          }

          console.log(this.categoryDropDown)
          console.log(this.lecturerTextBox)

          if(!args.data.category || args.data.category == ""){
            this.categoryDropDown.value = "";
          }
          else{
            this.categoryDropDown.value = (<{ [key: string]: Object }>(args.data)).category as string;
          }
        }
    }
  }
}
