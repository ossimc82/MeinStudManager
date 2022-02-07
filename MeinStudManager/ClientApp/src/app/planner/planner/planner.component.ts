import { Component, OnInit, ViewChild } from '@angular/core';
import { DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService, EventSettingsModel, EventRenderedArgs, ScheduleComponent } from '@syncfusion/ej2-angular-schedule';


@Component({
  selector: 'app-planner',
  providers: [DayService, WeekService, WorkWeekService, MonthService, AgendaService, MonthAgendaService, TimelineViewsService, TimelineMonthService],
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.css']
})
export class PlannerComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }


  @ViewChild('scheduleObj') public scheduleObj: ScheduleComponent;

  public data: object[] = [
    {id: 1,
      subject: 'Mathe 1',
      description: 'learn how to transponieren with GERD',
      startTime: new Date(2022, 1, 8, 10, 0), //Month starts at 0
      endTime: new Date(2022, 1, 8, 11, 30),
    },
    {id: 2,
      subject: 'GWT',
      description: 'Hardest Module u will ever visit',
      startTime: new Date(2022, 1, 8, 11, 45),
      endTime: new Date(2022, 1, 8, 13, 15),
      Color: '#bb2222'
    },
    {id: 3,
      subject: 'DBS V3',
      description: 'Datenbanksysteme DLC Content',
      startTime: new Date(2022, 1, 8, 14, 15),
      endTime: new Date(2022, 1, 8, 15, 45),
      Color: '#00bb22'
    }
  ];

  public eventSettings: EventSettingsModel = {
    dataSource: this.data,
    fields: {
    id: 'id',
    subject: { name: 'subject'},
    description: { name: 'description' },
    startTime: { name: 'startTime' },
    endTime: { name: 'endTime' },
    isBlock: 'isBlock'
    }
  };

  onEventRendered(args: EventRenderedArgs): void {
    let color: string = args.data.Color as string;
    if (!args.element || !color) {
        return;
    }
    if (this.scheduleObj.currentView === 'Agenda') {
        (args.element.firstChild as HTMLElement).style.borderLeftColor = color;
    } else {
        args.element.style.backgroundColor = color;
    }
  }
}
