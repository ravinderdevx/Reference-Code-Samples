import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldFilterPipe } from './field-filter.pipe';
import { MomentPipe } from './moment.pipe';
import { KeysPipe } from './keys.pipe';
import { OrderByPipe } from './order-by.pipe';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [FieldFilterPipe, MomentPipe, KeysPipe, OrderByPipe],
  exports: [FieldFilterPipe, MomentPipe, KeysPipe, OrderByPipe]
})
export class PipesModule { }
