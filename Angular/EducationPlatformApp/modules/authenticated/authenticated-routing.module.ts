import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './components/profile/profile.component';
import { ActivityLogComponent } from './components/activity-log/activity-log.component';
import { ResourcesComponent } from './components/resources/resources.component';
import { HomeComponent } from './components/home/home.component';
import { SummaryComponent } from './components/summary/summary.component';
import { LayoutComponent } from './layout/layout.component';

const AdminRoutes: Routes = [
  {
    path: "",
    component: LayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent
      },
      {
        path: "home",
        component: HomeComponent
      },
      {
        path: "profile",
        component: ProfileComponent
      },
      {
        path: "activity-log",
        component: ActivityLogComponent
      },
      {
        path: "resources",
        component: ResourcesComponent
      },
      {
        path: "summary",
        component: SummaryComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(AdminRoutes)],
  exports: [RouterModule]
})
export class AuthenticatedRoutingModule { }
