import { Route } from "@angular/router";

import { Page404Component } from "app/authentication/page404/page404.component";
import { PaymentPolicyComponent } from "./payment-policy.component";

export const PAYMENTPOLICY_ROUTE: Route[] = [
  {
    path: "paymentPolicy",
    component: PaymentPolicyComponent,
  },
  
  { path: "**", component: Page404Component },
];

