import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config';
import { ForgotPasswordModel } from 'src/app/core/models/forgot.email';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }

  login(data) {
    return this.http.post<any>(this.api + 'AuthAPI/Login', data);
  }
  register(data) {
    debugger;
    return this.http.post<any>(this.api + 'AuthAPI/Register', data);
  }
  sendForgotPasswordEmail(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/ForgotPassword', data);
  }

  validateResetPasswordToken(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/ValidateResetPasswordToken', data);
  }
  resetPassword(data: ForgotPasswordModel): Observable<any> {
    return this.http.post<any>(this.api + 'AuthAPI/ResetPassword', data);
  }
}
