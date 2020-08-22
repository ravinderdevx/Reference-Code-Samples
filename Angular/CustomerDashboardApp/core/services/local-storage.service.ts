import { constants } from './../../config/constants';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class LocalStorageService {
  LOCALSTORAGE_AUTH_USER: string = 'AuthUser';
  LOCALSTORAGE_EXPIRES_AT: string = "expires_at";
  LOCALSTORAGE_IMPERSONATE_USER: string = "ImpersonateUser"
  //LOCALSTORAGE_REMEMBER_ME: string = "remember_me";

  constructor() { }

  storeAuthUser(data, remember) {
    localStorage.setItem(this.LOCALSTORAGE_AUTH_USER, JSON.stringify(data));

    const currentDate = new Date()
    if(remember == true) {
      currentDate.setDate(currentDate.getDate() + 15);
      const expiryMiliseconds = currentDate.getTime();
      localStorage.setItem(this.LOCALSTORAGE_EXPIRES_AT, String(expiryMiliseconds));
    }
    // else {
    //   currentDate.setMinutes(currentDate.getMinutes() + 15);
    // }
     
  }

  isAuthenticated(): boolean {
    if(localStorage.getItem(this.LOCALSTORAGE_AUTH_USER)) {
      if(localStorage.getItem(this.LOCALSTORAGE_EXPIRES_AT)) {
        const expirtyTime = Number(localStorage.getItem(this.LOCALSTORAGE_EXPIRES_AT))
        const currentTime = new Date().getTime();
      
        if(expirtyTime > currentTime)
          return true;

        return false;
      } else {
        return true;
      }
    }
    return false;
  }

  isRememberMeChecked() {
    if(localStorage.getItem(this.LOCALSTORAGE_EXPIRES_AT))
      return true;
    return false;
  }

  getUserDetail() {
    let userDetailData = localStorage.getItem(this.LOCALSTORAGE_AUTH_USER);
    
    if(userDetailData)
      return JSON.parse(userDetailData);
    
    return null;
  }

  setImpersonateUserDetails(data) {
    localStorage.setItem(this.LOCALSTORAGE_IMPERSONATE_USER, JSON.stringify(data));
  }

  removeImpersonateUserDetails() {
    localStorage.removeItem(this.LOCALSTORAGE_IMPERSONATE_USER);
  }

  getImpersonateUserDetails() {
    let impersonateUserDetailData = localStorage.getItem(this.LOCALSTORAGE_IMPERSONATE_USER);
    
    if(impersonateUserDetailData)
      return JSON.parse(impersonateUserDetailData);
    
    return null;
  }

  getRedirectUrl() {
    const userDetails = this.getUserDetail();

    if(userDetails.ClaritySuperAdmin || userDetails.ClarityAdmin) {
      return constants.adminUrl;
    } else {
      return  constants.clientUrl;
    }
  }

  isClaritySuperAdmin(): boolean {
    if(!this.isAuthenticated())
      return false;

    const userDetails = this.getUserDetail();

    if(userDetails && userDetails.ClaritySuperAdmin == true)
      return true;
    else
      return false;
  }

  isClarityAdmin(): boolean {
    if(!this.isAuthenticated())
      return false;

    const userDetails = this.getUserDetail();

    if(userDetails && (userDetails.ClaritySuperAdmin == true || userDetails.ClarityAdmin == true))
      return true;
    else
      return false;
  }

  saveGlobalFilters(globalFilterSettings: CustomWidgetSettings) {
    const userDetails = this.getUserDetail();
    userDetails.GlobalFilterSettings = globalFilterSettings;
    localStorage.setItem(this.LOCALSTORAGE_AUTH_USER, JSON.stringify(userDetails));
  }

  saveImpersonateUserGlobalFilters(globalFilterSettings: CustomWidgetSettings) {
    const userDetails = this.getImpersonateUserDetails();
    userDetails.GlobalFilterSettings = globalFilterSettings;
    localStorage.setItem(this.LOCALSTORAGE_IMPERSONATE_USER, JSON.stringify(userDetails));
  }

  logout() {
    localStorage.clear();
  }

}
