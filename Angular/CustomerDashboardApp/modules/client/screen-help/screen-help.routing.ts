import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ScreenHelpComponent } from './screen-help.component';

const routes: Routes = [{
  path: '',
  component: ScreenHelpComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class ScreenHelpRoutingModule { }
