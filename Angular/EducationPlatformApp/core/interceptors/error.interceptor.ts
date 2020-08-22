import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { LocalStorageService } from "../services/local-storage.service";
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  modalRef: BsModalRef;
  constructor(private _localStorageService: LocalStorageService,
    private _route: Router, private _activatedRoute: ActivatedRoute) {
    }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
        if (err.status === 401) {
      
            // auto logout if 401 response returned from api
            // if(this.modalRef)
            // this.modalRef.hide();
            this._localStorageService.logout();
            window.location.href = "/bec/login";
            // this._route.navigate(['/login'],{queryParams:{ returnUrl: this._activatedRoute.snapshot.queryParams["returnUrl"]}});
            //location.reload(true);
        }

        const error = err.error.Message || err.statusText;
        return throwError(error);
    }));
  }
}
