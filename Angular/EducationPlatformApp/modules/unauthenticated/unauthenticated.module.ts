import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnauthenticatedRoutingModule } from './unauthenticated-routing.module';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ResetPasswordComponent } from './components/reset-password/reset-password.component';
import { SignupComponent } from './components/signup/signup.component';


@NgModule({
  declarations: [ForgotPasswordComponent, LoginComponent, ResetPasswordComponent,SignupComponent],
  imports: [
    CommonModule,
    SharedModule,
    UnauthenticatedRoutingModule,
  ]
})
export class UnauthenticatedModule { }
