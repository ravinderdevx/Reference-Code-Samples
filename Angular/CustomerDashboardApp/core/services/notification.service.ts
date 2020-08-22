import {Injectable} from '@angular/core';

declare var $: any;

@Injectable()
export class NotificationService {

  constructor() {
  }

  smallBox(data, cb?) {
    $.smallBox(data, cb)
  }

  bigBox(data, cb?) {
    $.bigBox(data, cb)
  }

  smartMessageBox(data, cb?) {
    $.SmartMessageBox(data, cb)
  }

  successSmallMessageBox(message, timeout = 5000) {
    $.smallBox({
      title: "Success",
      content: message,
      color: "#296191",
      timeout: timeout,
      sound: false,
      icon: "fa fa-thumbs-up bounce animated",
    });
  }

  errorSmallMessageBox(message, timeout = 5000) {
    $.smallBox({
      title: "Error!",
      content: message,
      color: "#bd362f",
      icon: "fa fa-warning shake animated",
      sound: false,
      timeout: timeout,
    });
  }
}
