import { Route } from "@angular/router";

import { Page404Component } from "app/authentication/page404/page404.component";
import { PosteComponent } from "./poste.component";

export const POSTE_ROUTE: Route[] = [
  {
    path: "Poste",
    component: PosteComponent,
  },
  
  { path: "**", component: Page404Component },
];

