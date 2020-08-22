import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { WidgetsPageRoutingModule } from './widgets-page.routing';
import { WidgetsPageComponent } from './widgets-page.component';
import { AddWidgetComponent } from './add-widget/add-widget.component';
import { GlobalFilterComponent } from './global-filter/global-filter.component';

@NgModule({
  declarations: [WidgetsPageComponent, AddWidgetComponent, GlobalFilterComponent],
  imports: [
    SharedModule,
    WidgetsPageRoutingModule
  ]
})
export class WidgetsPageModule { }
