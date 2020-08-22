import { NgModule } from '@angular/core';
import { EmailConfirmationRoutingModule } from './email-confirmation.routing';
import { EmailConfirmationComponent } from './email-confirmation.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    EmailConfirmationRoutingModule
  ],
  declarations: [EmailConfirmationComponent]
})
export class EmailConfirmationModule { }
