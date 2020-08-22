import { Injectable } from '@angular/core';

import { AlertModel } from '../models/alert.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private dismissOnTimeout: number = 5000;

  successMessageObject(message: string): AlertModel {
    return {
      type: "success",
      message: message,
      text: "Success",
      timeout: this.dismissOnTimeout
    };
  };

  errorMessageObject(message: string): AlertModel {
    return {
      type: "danger",
      message: message,
      text: "Error",
      timeout: this.dismissOnTimeout
    };
  };

  warningMessageObject(message: string): AlertModel {
    return {
      type: "warning",
      message: message,
      text: "Warning",
      timeout: this.dismissOnTimeout
    };
  };

  infoMessageObject(message: string): AlertModel {
    return {
      type: "info",
      message: message,
      text: "Info",
      timeout: this.dismissOnTimeout
    };
  };
}
