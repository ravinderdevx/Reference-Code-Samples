import { LocalStorageService } from './../../../core/services/local-storage.service';
import { Component, OnInit, TemplateRef, Output, EventEmitter, ElementRef, Input } from "@angular/core";
import { Router } from "@angular/router";

import { errorMessages, successMessages } from "@app/config/messages.config";
import {
  AuthService,
  ResponseService,
  MessageService
} from "@app/core/services";
import { NgForm } from "@angular/forms";

@Component({
  selector: "app-assistance-modal",
  templateUrl: "./assistance-modal.component.html",
  styles: []
})
export class AssistanceModalComponent {
  @Output() close = new EventEmitter()
  
  initialLoading: boolean = false;
  loading: boolean = false;
  messageObject: any;

  userDetails: any;
  assistanceModel: any;

  public validationOptions:any = {
    rules: {
      subject: {
        required: true
      },
      message: {
        required: true
      }
    }
  };

  constructor(
    private messageService: MessageService,
    private localStorageService: LocalStorageService,
    private responseService: ResponseService,
    private authService: AuthService,
  ) {
  }

  ngOnInit() {
    this.userDetails = this.localStorageService.getUserDetail();
    this.assistanceModel = {
      Subject: null,
      Message: null
    }
  }

  sendMessage() {
    if(!$("form[name='assistanceform']").valid()) return false;

    let request: any = Object.assign({}, this.assistanceModel);
    request.Name = this.userDetails.FirstName + " " + this.userDetails.LastName;
    request.Email = this.userDetails.Email;

    this.authService.executeStitchFunction("sendAssistanceEmail", [request]).then(
      response => {
        if (response.success == true) {
          this.messageObject = this.messageService.successMessageObject(successMessages.ASSISTANCE_MAIL_SUCCESS);

          setTimeout(() => {
            this.close.emit(true);
          }, 2000)
        } else {
          this.messageObject = this.messageService.errorMessageObject(response.message);
        }
      },
      error => {
        const message = this.responseService.handleError(
          error,
          errorMessages.DATA_FETCH_FAILURE
        );
        this.messageObject = this.messageService.errorMessageObject(message);
      }
    );
  }
}
