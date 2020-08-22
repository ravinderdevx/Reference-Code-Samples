import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardComponent } from './dashboard.component';
import { ClientRegisterComponent } from './client-register/client-register.component';
import { DataImportComponent } from './data-import/data-import.component';

@NgModule({
  declarations: [DashboardComponent, ClientRegisterComponent, DataImportComponent],
  imports: [
    SharedModule,
    DashboardRoutingModule
  ]
}) 
export class DashboardModule { }
