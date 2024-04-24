import { Page404Component } from '../authentication/page404/page404.component';
import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AttendancesComponent } from './attendance/attendance.component';
import { MyTeamsComponent } from './myteam/myteam.component';
import { SettingsComponent } from './settings/settings.component';
import { MyLeavesComponent } from './my-leaves/my-leaves.component';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { EmployeeProfileComponent } from 'app/admin/employees/employee-profile/employee-profile.component';
export const EMPLOYEE_ROUTE: Route[] = [
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'attendance',
    component: AttendancesComponent,
  },
  {
    path: 'myteam',
    component: MyTeamsComponent,
  },
  {
    path: 'myprojects',
    component: MyProjectsComponent,
  },
  {path:'mission',
  loadChildren:()=>import('./missions/missionemployee.routes').then((m)=>m.EMPLOYEE_MISSION_ROUTE)},
  {
    path: 'mytasks',
    component: MyTasksComponent,
  },
  {
    path: 'myleaves',
    component: MyLeavesComponent,
  },
  {
    path: 'settings',
    component: SettingsComponent,
  },
  {path : 'profile' , component:EmployeeProfileComponent},
  
  { path: '**', component: Page404Component },
];

