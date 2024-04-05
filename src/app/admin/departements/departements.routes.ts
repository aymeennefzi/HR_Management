import { Route } from "@angular/router";
import { AlldepartementsComponent } from "./alldepartements/alldepartements.component";
import { AddDepartementComponent } from "./add-departement/add-departement.component";

export const ADMIN_DEPARTEMENT_ROUTE: Route[] = [
    {
      path: "alldepartements",
      component: AlldepartementsComponent,
    },
    {
      path: "add-departement",
      component: AddDepartementComponent,
    },
   
  ];
  