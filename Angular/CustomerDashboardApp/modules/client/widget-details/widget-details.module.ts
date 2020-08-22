import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetDetailsRoutingModule } from './widget-details.routing';
import { WidgetDetailsComponent } from './widget-details.component';

@NgModule({
  declarations: [WidgetDetailsComponent],
  imports: [
    SharedModule,
    WidgetDetailsRoutingModule
  ]
})
export class WidgetDetailsModule { }
