import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WidgetsPageComponent } from './widgets-page.component';

const routes: Routes = [{
  path: '',
  component: WidgetsPageComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class WidgetsPageRoutingModule { }
