import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Store, select } from "@ngrx/store";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";

import * as fromAuth from "../store/auth";
import { constants } from '@app/config/constants';

import { LocalStorageService } from '@app/core/services';


@Injectable()
export class SuperAdminAuthGuard implements CanActivate {

  constructor(private localStorageService: LocalStorageService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const status = this.localStorageService.isClaritySuperAdmin();
      if (status) {
        return true;
      }

      this.router.navigate(['/login']);
      return false;
  }
}
