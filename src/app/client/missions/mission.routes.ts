import { Route } from "@angular/router";
import { MymissionsComponent } from "./mymissions/mymissions.component";
import { Page404Component } from './../../authentication/page404/page404.component';

export const CLIENT_MISSION_ROUTE: Route[]=[
    {path:"missions",component:MymissionsComponent},
    { path: "**", component: Page404Component },
] 
