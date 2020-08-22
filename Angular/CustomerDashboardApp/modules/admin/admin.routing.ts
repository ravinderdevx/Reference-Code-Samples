import { Routes, RouterModule } from '@angular/router';
import { MainLayoutComponent } from '@app/shared/layout/app-layouts/main-layout.component';
import { AdminAuthGuard, SuperAdminAuthGuard } from '@app/core/guards';


export const routes: Routes = [
  {
    path: "",
    component: MainLayoutComponent,
    data: { pageTitle: "Home" },
    children: [
      {
        path: "",
        redirectTo: "dashboard",
        pathMatch: "full"
      },
      {
        path: "dashboard",
        data: { pageTitle: "Dashboard" },
        loadChildren: "./admin-dashboard/dashboard.module#DashboardModule",
        canActivate: [AdminAuthGuard]
      },
      {
        path: "users",
        data: { pageTitle: "Manage Users" },
        loadChildren: "./manage-users/manage-users.module#ManageUsersModule",
        canActivate: [SuperAdminAuthGuard]
      }
    ]
  }
];
  
export const AdminRouting = RouterModule.forChild(routes);
  