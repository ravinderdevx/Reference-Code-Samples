import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';

import { ManageUsersRoutingModule } from './manage-users.routing';
import { ManageUsersComponent } from './manage-users.component';
import { UserRegisterComponent } from './user-register/user-register.component';

@NgModule({
  declarations: [ManageUsersComponent, UserRegisterComponent],
  imports: [
    SharedModule,
    ManageUsersRoutingModule
  ]
}) 
export class ManageUsersModule { }
