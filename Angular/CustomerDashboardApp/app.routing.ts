import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard, AdminAuthGuard, UnAuthGuard } from "./core/guards";

const routes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "",
    loadChildren: "./modules/auth/auth.module#AuthModule",
    canActivate: [UnAuthGuard]
  },
  {
    path: "client",
    loadChildren: "./modules/client/client.module#ClientModule",
    canActivate: [AuthGuard]
  },
  {
    path: "admin",
    loadChildren: "./modules/admin/admin.module#AdminModule"
  },
  { 
    path: "**", 
    redirectTo: "miscellaneous/error404" 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
