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
<<<<<<< HEAD
import { ChangeProfileComponent } from './profile/change-profile/change-profile.component';
import { PerformanceRecordComponent } from './profile/performance-record/performance-record.component';
=======
import { PlannerService } from './planner/planner/planner.service';
>>>>>>> 292de26d8cdd32ea3d1a5f9ddfad442addd4b5bd



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
    PerformanceRecordComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    ScheduleModule
  ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    PlannerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
