import { Route } from "@angular/router";
import { Page404Component } from "app/authentication/page404/page404.component";
import { AllthemissionsComponent } from "./allthemissions/allthemissions.component";
import { AssignUsertoMissionComponent } from "./assign-userto-mission/assign-userto-mission.component";

export const ADMIN_EMPLOYEE_ROUTE: Route[] = [
{path:"allmissions",component:AllthemissionsComponent},
{path:"assignusertomission/:_id",component:AssignUsertoMissionComponent},
{ path: "**", component: Page404Component },



]
