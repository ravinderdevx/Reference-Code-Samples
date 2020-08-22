import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';


@Injectable({
    providedIn: 'root'
})

export class CustomGuard implements CanActivate {

    constructor(private _localStorageService: LocalStorageService, private router: Router) { }

    canActivate(

        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        let expectedRoleArray = route.data;
        let canAcess: boolean = false;
        const status = this._localStorageService.isAuthenticated();
        expectedRoleArray = expectedRoleArray.expectedRole;

        const userdetailarray = this._localStorageService.getUserDetail();
        const data = userdetailarray.Permissions;
        for (let i = 0; i < expectedRoleArray.length; i++) {
            for (let userdata of data) {
                if ( expectedRoleArray[i]== 'profile' || expectedRoleArray[i].toLowerCase().trim() == userdata.PermissionName.toLowerCase().trim()) {
                    canAcess = true;
                    break;
                }
            }
        }
        if (status && canAcess) {
            console.log("User permitted to access the route");
            return true;
        }

        else if (status) {
            this.router.navigate(['/admin/unauthorised']);
            return false;

        }
        else {
            this.router.navigate(['/error'])
            return false;
        }
        // this.router.navigate(['/error'], { queryParams: { returnUrl: state.url } });
        // return false;
    }
}
