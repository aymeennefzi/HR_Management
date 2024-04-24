import { Route } from '@angular/router';
import { MainLayoutComponent } from './layout/app-layout/main-layout/main-layout.component';
import { AuthGuard } from '@core/guard/auth.guard';
import { AuthLayoutComponent } from './layout/app-layout/auth-layout/auth-layout.component';
import {LandingPageComponent} from "./layout/landing-page/landing-page.component";
import { Page404Component } from './authentication/page404/page404.component';

export const APP_ROUTE: Route[] = [
  //{ path: '', redirectTo: '/home', pathMatch: 'full' }, // Redirection vers '/home' par défaut

  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },

      {
        path: 'admin',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./admin/admin.routes').then((m) => m.ADMIN_ROUTE),
      },
      {
        path: 'employee',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./employee/employee.routes').then((m) => m.EMPLOYEE_ROUTE),
      },
      {
        path: 'client',
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./client/client.routes').then((m) => m.CLIENT_ROUTE),
      },
      {
        path: 'calendar',
        loadChildren: () =>
          import('./calendar/calendar.routes').then((m) => m.CALENDAR_ROUTE),
      },
      {
        path: 'task',
        loadChildren: () =>
          import('./task/task.routes').then((m) => m.TASK_ROUTE),
      },
    ],
  },
  {
    path: 'authentication',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./authentication/auth.routes').then((m) => m.AUTH_ROUTE),
  },
  {path : 'home' , component : LandingPageComponent},

  { path: '**', component: Page404Component },
];
