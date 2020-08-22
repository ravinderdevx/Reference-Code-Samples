import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmailConfirmationComponent} from "./email-confirmation.component";

const routes: Routes = [{
  path: '',
  component: EmailConfirmationComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class EmailConfirmationRoutingModule { }
