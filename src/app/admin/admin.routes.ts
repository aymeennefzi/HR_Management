import { Route } from '@angular/router';
import { BillingComponent } from 'app/client/billing/billing.component';
import { PerformanceComponent } from './performance/performance.component';

export const ADMIN_ROUTE: Route[] = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.routes').then((m) => m.ADMIN_DASHBOARD_ROUTE),
  },
  {
    path: 'projects',
    loadChildren: () =>
      import('./projects/projects.routes').then((m) => m.PROJECT_ROUTE),
  },
  {
    path:'mission',

    loadChildren:()=>import('./missions/missions.routes').then((m)=>m.ADMIN_EMPLOYEE_ROUTE)
  },
  {
    path: 'employees',
    loadChildren: () =>
      import('./employees/employees.routes').then((m) => m.ADMIN_EMPLOYEE_ROUTE),
  },
  {
    path: 'clients',
    loadChildren: () =>
      import('./clients/clients.routes').then((m) => m.ADMIN_CLIENT_ROUTE),
  },
  {
    path: 'leaves',
    loadChildren: () =>
      import('./leaves/leaves.routes').then((m) => m.LEAVE_ROUTE),
  },
  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/accounts.routes').then((m) => m.ACCOUNT_ROUTE),
  },
  {
    path: 'holidays',
    loadChildren: () =>
      import('./holidays/holidays.routes').then((m) => m.HOLIDAY_ROUTE),
  },
  {
    path: 'departements',
    loadChildren: () =>
      import('./departements/departements.routes').then((m) => m.ADMIN_DEPARTEMENT_ROUTE),
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance.routes').then((m) => m.ATTENDANCE_ROUTE),
  },
  {
    path: 'payroll',
    loadChildren: () =>
      import('./payroll/payroll.routes').then((m) => m.PAYROLL_ROUTE),
  },
  {
    path: 'leads',
    loadChildren: () =>
      import('./leads/leads.routes').then((m) => m.LEADS_ROUTE),
  },
  {
    path: 'jobs',
    loadChildren: () => import('./jobs/jobs.routes').then((m) => m.JOBS_ROUTE),
  },

  {
    path: 'Policy',
    loadChildren: () =>
      import('./payment-policy/paymentPolicy.routes').then((m) => m.PAYMENTPOLICY_ROUTE),
  },
  {
    path : 'performance' , component : PerformanceComponent
  },
  {
    path: 'Policy',
    loadChildren: () =>
      import('./payment-policy/paymentPolicy.routes').then((m) => m.PAYMENTPOLICY_ROUTE),
  },
  {
    path: 'Postes',
    loadChildren: () =>
      import('./poste/poste.routes').then((m) => m.POSTE_ROUTE),
  }
  
];

