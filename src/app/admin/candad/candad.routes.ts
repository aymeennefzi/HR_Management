import { Route } from "@angular/router";
import {  candadComponent } from "./candad.component";
import { Page404Component } from "app/authentication/page404/page404.component";

export const CANDAD_ROUTE: Route[] = [
    {
      path: "",
      component: candadComponent,
    },
    { path: "**", component: Page404Component },
  ];