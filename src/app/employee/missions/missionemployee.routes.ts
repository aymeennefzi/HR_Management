import { Route } from "@angular/router";
import { MissionemployeeComponent } from "./missionemployee/missionemployee.component";
import { Page404Component } from "app/authentication/page404/page404.component";

export const EMPLOYEE_MISSION_ROUTE: Route[]=[
    {path:"missions",component:MissionemployeeComponent},
    { path: "**", component: Page404Component },
] 
