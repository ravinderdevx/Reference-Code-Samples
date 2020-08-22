import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { CustomTableComponent } from './custom-table.component';
import { BootstrapModule } from '@app/shared/bootstrap.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    BootstrapModule
  ],
  declarations: [CustomTableComponent],
  exports: [CustomTableComponent],
})
export class SmartadminCustomTableModule { }
