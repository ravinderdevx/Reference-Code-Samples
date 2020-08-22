import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ReportsRoutingModule } from './reports.routing';
import { ReportsComponent } from './reports.component';
import { DataExportComponent } from './data-export/data-export.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';

@NgModule({
  imports: [
    SharedModule,
    ReportsRoutingModule
  ],
  declarations: [ReportsComponent, DataExportComponent, UploadFilesComponent]
})
export class ReportsModule { }
