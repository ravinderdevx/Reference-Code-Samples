import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import * as fromAuth from "../store/auth";

import { LocalStorageService } from '@app/core/services';


@Injectable()
export class AuthGuard implements CanActivate {
  //constructor(private store: Store<fromAuth.AuthState>) {}

  //canActivate(): Observable<boolean> {
    // return this.store.pipe(
    //   select(fromAuth.getLoggedIn),
    //   map(authed => {
    //     if (!authed) {
    //       this.store.dispatch(new fromAuth.LoginRedirect("/dashboard"));
    //       return false;
    //     }

    //     return true;
    //   }),
    //   take(1)
    // );
  //}

  constructor(private localStorageService: LocalStorageService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const status = this.localStorageService.isAuthenticated();
      if (status) {
        return true;
      }
      this.localStorageService.logout();
      this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
      return false;
  }
}
