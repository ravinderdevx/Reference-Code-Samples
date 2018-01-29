import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';

import { Constants } from "../commmon/constants";


@Injectable()
export class KeyboardService {
    constructor(private objHttp: Http) { }


    // function to save ckyb data 
    submitSaveckyb(ckybData): Observable<any> {
        debugger;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.objHttp.post(Constants.Save_ckyb, ckybData, options).map((response: Response) => response.json());
    }

    // function to get all ckyb 
    getAllckyb(): Observable<any> {
        return this.objHttp.get(Constants.GetAll_ckyb).map((response: Response) => response.json());
    }

    // function to get all ckyba
    getAllckyba(ckybaRequest): Observable<any> {
        debugger;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.objHttp.post(Constants.GetAll_ckyba, ckybaRequest, options).map((response: Response) => response.json());
    }

    // function to update ckyba data 
    updateAllckyba(ckybaDataList): Observable<any> {
        debugger;
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });
        return this.objHttp.post(Constants.UpdateAll_ckyba, ckybaDataList, options).map((response: Response) => response.json());
    }
}
