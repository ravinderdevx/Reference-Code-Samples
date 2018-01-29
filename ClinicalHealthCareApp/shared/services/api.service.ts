import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Headers, Http, Response, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
    constructor(private _http: Http) { }

    /*
      Created By   : Harmesh
      Created Date : 10-01-2018
      Purpose      : Set headers for http request
    */

    private setHeaders(): Headers {
        const headersConfig = {
            'Content-Type': 'application/json'
        };
        return new Headers(headersConfig);
    }
    
    private formatErrors(error: any) {
        return Observable.throw(error.json());
    }


    /*
       Created By   : Harmesh
       Created Date : 10-01-2018
       Purpose      : Common http get request without token. 
     */
    get(path: string, params: URLSearchParams = new URLSearchParams()): Observable<any> {
        return this._http.get(path)
            .catch(this.formatErrors)
            .map((res: Response) => res.json());
    }


    /*
      Created By   : Harmesh
      Created Date : 10-01-2018
      Purpose      : Common http post request without token. 
    */
    post(path: string, body: Object = {}): Observable<any> {
        return this._http.post(path, body)
            .catch(this.formatErrors)
            .map((res: Response) => res.json());
    }
}