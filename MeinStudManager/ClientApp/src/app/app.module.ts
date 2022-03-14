import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FetchDataComponent } from './fetch-data/fetch-data.component';
import { HeaderComponent } from './header/header.component';
import { AppRoutingModule } from './app-routing.module';
import { ProfileComponent } from './profile/profile.component';
import { AuthComponent } from './auth/auth.component';
import { RegisterComponent } from './auth/register/register.component';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { PlannerComponent } from './planner/planner/planner.component';
import { ScheduleModule } from '@syncfusion/ej2-angular-schedule';
import { ChangeProfileComponent } from './profile/change-profile/change-profile.component';
import { PerformanceRecordComponent } from './profile/performance-record/performance-record.component';
import { PlannerService } from './planner/planner/planner.service';
import { StudyComponent } from './study/study.component';
import { ForumComponent } from './forum/forum.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MdbModalModule } from 'mdb-angular-ui-kit/modal';


import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { ForumService } from './forum/forum.service';
import { ForumTopicComponent } from './forum/topic/forum-topic.component';
import { ForumCustomDialog } from './forum/topic/customDialog/customDialog-component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ForumPostCreatorModule } from './forum/editor/post-creator.module';
import { MethodComponent } from './study/study-page/method/method.component';
import { TimerComponent } from './study/study-page/timer/timer.component';
import { StopwatchComponent } from './study/study-page/stopwatch/stopwatch.component';
import { MethodDetailsComponent } from './study/study-page/method-details/method-details.component';
import { StudyPageComponent } from './study/study-page/study-page.component';
import { ModalComponent } from './study/study-page/timer/modal/modal.component';
import { TodoListComponent } from './study/study-page/todo-list/todo-list.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FetchDataComponent,
    HeaderComponent,
    ProfileComponent,
    AuthComponent,
    RegisterComponent,
    LoadingSpinnerComponent,
    PlannerComponent,
    ChangeProfileComponent,
    PerformanceRecordComponent,
    StudyComponent,
    ForumComponent,
    ForumCustomDialog,
    ForumTopicComponent,
    MethodComponent,
    TimerComponent,
    StopwatchComponent,
    MethodDetailsComponent,
    StudyPageComponent,
    ModalComponent,
    TodoListComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScheduleModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    ForumPostCreatorModule,
    MdbModalModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    PlannerService,
    ForumService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
