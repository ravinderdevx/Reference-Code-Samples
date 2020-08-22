import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';



const HomeRoutes: Routes = [
  {
      path: "",
      redirectTo: "login",
      pathMatch: "full"
    },
    {
      path: "login",
      component: LoginComponent
    },
    {
      path: "signup",
      component: SignupComponent
    },
    {
      path: "forgotPassword",
      component:ForgotPasswordComponent
    },
    {
      path: "reset-password",
      component:ResetPasswordComponent
    }
];

@NgModule({
  imports: [RouterModule.forChild(HomeRoutes)],
  exports: [RouterModule]
})
export class UnauthenticatedRoutingModule { }
