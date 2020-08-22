import { NgModule } from '@angular/core';
import { ResetPasswordRoutingModule } from './reset-password.routing';
import { ResetPasswordComponent } from './reset-password.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ResetPasswordRoutingModule
  ],
  declarations: [ResetPasswordComponent]
})
export class ResetPasswordModule { }
