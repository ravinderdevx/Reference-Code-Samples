import { Injectable } from "@angular/core";

@Injectable()
export class MessageService {
  dismissOnTimeout: number = 5000;
  constructor() {}

  successMessageObject(message): MessageModel {
    return {
      type: "success",
      message: message,
      text: "Success",
      timeout: this.dismissOnTimeout
    };
  }

  errorMessageObject(message): MessageModel {
    return {
      type: "danger",
      message: message,
      text: "Error",
      timeout: this.dismissOnTimeout
    };
  }

  warningMessageObject(message): MessageModel {
    return {
      type: "warning",
      message: message,
      text: "Warning",
      timeout: this.dismissOnTimeout
    };
  }

  infoMessageObject(message): MessageModel {
    return {
      type: "info",
      message: message,
      text: "Info",
      timeout: this.dismissOnTimeout
    };
  }
}
