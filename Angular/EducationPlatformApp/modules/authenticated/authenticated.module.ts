import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { ProfileComponent } from './components/profile/profile.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { SummaryComponent } from './components/summary/summary.component';
import { HomeComponent } from './components/home/home.component';
import { LayoutComponent } from './layout/layout.component';



@NgModule({
  declarations: [LayoutComponent,HomeComponent,ProfileComponent, ActivityLogComponent, ResourcesComponent, SummaryComponent],
  imports: [
    CommonModule,
    AuthenticatedRoutingModule,
    SharedModule
  ]
})
export class AuthenticatedModule { }
