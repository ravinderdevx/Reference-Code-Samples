import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";

import { errorMessages, successMessages } from "@app/config/messages.config";
import {
  AuthService,
  ResponseService,
  MessageService
} from "@app/core/services";

@Component({
  selector: "add-widget",
  templateUrl: "./add-widget.component.html"
})
export class AddWidgetComponent {
  @Output() close = new EventEmitter()
  @Output() onAdd = new EventEmitter();
  
  loading: boolean = false;
  messageObject: any;
  selectedIndex: number = -1;

  @Input() public screenWidgets;
  @Input() public configObject: ConfigModel;

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
  ) { }

  addWidget() {
    if(this.selectedIndex <= -1) return false;

    let request: any = {};
    if(this.configObject.configurationMode) {
      request.screenUrl = this.configObject.dashboardConfigUrl;
      request.configScreenUrl = this.configObject.screenUrl;
    } else {
      request.userId = this.configObject.userId;
      request.screenUrl = this.configObject.screenUrl;
    }
    request.configurationMode = this.configObject.configurationMode;

    request.widgetId = this.screenWidgets[this.selectedIndex]._id;

    this.loading = true;

    this.authService
      .executeStitchFunction("addScreenWidget", [request])
      .then(
        response => {
          this.loading = false;
          if (response.success == true) {
            this.onAdd.emit(response.data);
            this.close.emit();
          } else {
            this.messageObject = this.messageService.errorMessageObject(response.message);
          }
        },
        error => {
          this.loading = false;
          console.log(error.message);

          const message = this.responseService.handleError(
            error,
            errorMessages.REGISTERATION_FAILURE
          );
          this.messageObject = this.messageService.errorMessageObject(message);
        }
      );
  }

}
