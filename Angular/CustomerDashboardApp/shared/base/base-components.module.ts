import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { BaseClientComponent } from './base-client.component';
import { BaseWidgetComponent } from './base-widget.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BaseClientComponent,
    BaseWidgetComponent
  ],
  exports: [
    BaseClientComponent,
    BaseWidgetComponent
  ],
  providers: []
})
export class BaseComponentsModule {}
