import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from "@angular/common/http";
import { Observable } from "rxjs";

import { LocalStorageService } from "../services";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private _localStorageService: LocalStorageService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Content Type Header
    if (request.method == "POST") {
      request = request.clone({
        setHeaders: {
          "Content-Type": "application/json"
        }
      });
    }

    // add authorization header with jwt token if available
    const isLoggedIn = this._localStorageService.isAuthenticated();
    if (isLoggedIn) {
      const token = this._localStorageService.getAuthorizationToken();
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    return next.handle(request);
  }
}
