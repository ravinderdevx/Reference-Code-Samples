import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { ForgotRoutingModule } from './forgot-routing.module';
import { ForgotComponent } from './forgot.component';

@NgModule({
  imports: [
    SharedModule,
    ForgotRoutingModule
  ],
  declarations: [ForgotComponent]
})
export class ForgotModule { }
