import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthComponent } from "./auth/auth.component";
import { AuthGuard } from "./auth/auth.guard";
import { RegisterComponent } from "./auth/register/register.component";
import { HomeComponent } from "./home/home.component";
import { PlannerComponent } from "./planner/planner/planner.component";
import { ChangeProfileComponent } from "./profile/change-profile/change-profile.component";
import { PerformanceRecordComponent } from "./profile/performance-record/performance-record.component";
import { ProfileComponent } from "./profile/profile.component";
import { StudyComponent } from "./study/study.component";
import { ForumComponent } from "./forum/forum.component"


// add canActivate: [AuthGuard] to route if route should only be accessible after login

const appRoutes: Routes = [
  { path: '', redirectTo:'/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'profile', component: ProfileComponent,  canActivate: [AuthGuard], children:
    [
    {path: 'settings', component: ChangeProfileComponent},
    {path: 'notenspiegel', component: PerformanceRecordComponent}
    ]
  },
  { path: 'lernen', component: StudyComponent  },
  { path: 'login', component: AuthComponent  },
  { path: 'register', component: RegisterComponent },
  { path: 'planner', component: PlannerComponent },
  { path: 'forum', component: ForumComponent },
  {path: '**', redirectTo: '/home'}
]

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})

export class AppRoutingModule {

}
