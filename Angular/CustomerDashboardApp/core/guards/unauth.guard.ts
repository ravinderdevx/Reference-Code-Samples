import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from "@angular/router";
import { Observable } from "rxjs";

import { LocalStorageService } from '@app/core/services';


@Injectable()
export class UnAuthGuard implements CanActivate {
  constructor(private localStorageService: LocalStorageService, private router: Router){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      const status = this.localStorageService.isAuthenticated();
      if (!status) {
        return true;
      }
      
      const redirectUrl = this.localStorageService.getRedirectUrl();
      this.router.navigate([redirectUrl]);
      
      return false;
  }
}
