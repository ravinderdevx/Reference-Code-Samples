import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { LocationsDropdownComponent } from "./locations.component";
import { ServicesDropdownComponent } from "./services.component";
import { DateRangeDropdownComponent } from "./date-range.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: [
    ServicesDropdownComponent,
    LocationsDropdownComponent,
    DateRangeDropdownComponent
  ],
  exports: [
    ServicesDropdownComponent,
    LocationsDropdownComponent,
    DateRangeDropdownComponent
  ],
  providers: []
})
export class DropdownsModule {}
