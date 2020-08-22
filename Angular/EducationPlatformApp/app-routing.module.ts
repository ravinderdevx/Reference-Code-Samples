import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//Guards
// import { AuthGuard } from './core/guards/auth.guard';

//Components
// import { ErrorComponent } from './shared/components/error/error.component';



const AppRoutes: Routes = [
  {
    path: "",
    redirectTo: "",
    pathMatch: "full"
  },
  {
    path: "",
    loadChildren: ()=>import(`./modules/unauthenticated/unauthenticated.module`).then(m=>m.UnauthenticatedModule)
  },
  {
    path: "auth",
    loadChildren:()=>import(`./modules/authenticated/authenticated.module`).then(m=>m.AuthenticatedModule)
  },
];

@NgModule({
  imports:
    [
      RouterModule.forRoot(AppRoutes)
    ],
  exports: [RouterModule]
})
export class AppRoutingModule { }