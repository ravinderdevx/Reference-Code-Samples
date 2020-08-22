import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetDetailsComponent } from './widget-details.component';

const routes: Routes = [{
  path: '',
  component: WidgetDetailsComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WidgetDetailsRoutingModule { }
