import { NgModule } from '@angular/core';
import { LoginRoutingModule } from './login.routing';
import { LoginComponent } from './login.component';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule
  ],
  providers: [],
  declarations: [LoginComponent]
})
export class LoginModule { }
