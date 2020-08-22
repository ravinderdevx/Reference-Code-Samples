
import {Routes, RouterModule} from "@angular/router";
import { AuthLayoutComponent } from "@app/shared/layout/app-layouts/auth-layout.component";

export const routes: Routes = [
  {
    path: "",
    component: AuthLayoutComponent,
    children: [
      {
        path: "",
        redirectTo: "login",
        pathMatch: "full"
      },
      {
        path: 'login',
        loadChildren: './login/login.module#LoginModule'
      },
      // {
      //   path: 'register',
      //   loadChildren: './register/register.module#RegisterModule'
      // },
      {
        path: 'forgot-password',
        loadChildren: './forgot/forgot.module#ForgotModule'
      },
      {
        path: 'email-confirmation',
        loadChildren: './email-confirmation/email-confirmation.module#EmailConfirmationModule'
      },
      {
        path: 'reset-password',
        loadChildren: './reset-password/reset-password.module#ResetPasswordModule'
      }
    ]
  }
];

export const AuthRouting = RouterModule.forChild(routes);
