import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { UserListingComponent } from './user-listing.component';
import { UserListingRoutingModule } from './user-listing.routing';

@NgModule({
  declarations: [UserListingComponent],
  imports: [
    SharedModule,
    UserListingRoutingModule
  ]
})
export class UserListingModule { }
