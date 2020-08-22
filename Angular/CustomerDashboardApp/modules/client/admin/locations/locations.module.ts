import { NgModule } from '@angular/core';
import { LocationsComponent } from './locations.component';
import { LocationsRoutingModule } from './locations.routing';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [LocationsComponent],
  imports: [
    SharedModule,
    LocationsRoutingModule
  ]
})
export class LocationsModule { }
