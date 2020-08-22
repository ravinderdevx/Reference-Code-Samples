import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {Router} from "@angular/router";
import { errorMessages, successMessages } from '@app/config/messages.config';

import { AuthService, MessageService, ResponseService } from '@app/core/services';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styles: []
})
export class ForgotComponent implements OnInit {
  loading: boolean = false;

  messageObject: any;

  forgotForm: EmailModel = {
    email: null
  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private authService: AuthService,
    private responseService: ResponseService
  ) { }

  ngOnInit() {
    
  }

  handleForgotPassword(form: NgForm) {
    this.loading = true;
    this.authService.sendResetPasswordEmail(this.forgotForm).then(response => {
      this.loading = false;
      this.messageObject = this.messageService.successMessageObject(successMessages.FORGOT_PASSWORD_EMAIL_SENT);
      form.resetForm();
    }, error => {
      this.loading = false;
      const message = this.responseService.handleError(error, errorMessages.FORGOT_PASSWORD_FAILURE);
      this.messageObject = this.messageService.errorMessageObject(message);     
    });
  }
}
