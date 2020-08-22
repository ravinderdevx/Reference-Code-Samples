import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BaseUrl } from '../../../config/urls.config';
import { ForgotPasswordModel } from 'src/app/core/models/forgot.email';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  api = BaseUrl.baseApiUrl;
  constructor(private http: HttpClient) { }

  getResources(data) {
    return this.http.post<any>(this.api + 'ResourceAPI/',data);
  }
 
  getActivities(data) {
    return this.http.post<any>(this.api + 'ActivityAPI/', data);
  }
}
