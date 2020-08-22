import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ScreenHelpRoutingModule } from './screen-help.routing';
import { ScreenHelpComponent } from './screen-help.component';

@NgModule({
  imports: [
    SharedModule,
    ScreenHelpRoutingModule
  ],
  declarations: [ScreenHelpComponent]
})
export class ScreenHelpModule { }