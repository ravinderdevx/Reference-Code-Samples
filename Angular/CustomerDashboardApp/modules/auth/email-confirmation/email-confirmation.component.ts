import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { NgForm } from '@angular/forms';

import { AuthService, MessageService, ResponseService } from '@app/core/services';
import { successMessages, errorMessages } from '@app/config/messages.config';

@Component({
  selector: 'app-email-confirmation',
  templateUrl: './email-confirmation.component.html',
  styleUrls: [
    './email-confirmation.component.css'
  ]
})
export class EmailConfirmationComponent implements OnInit {
  loading: boolean = false;
  messageObject: any;
  confirmationMessage: string; 
  tokenModel: TokenModel;
  emailVerificationError: boolean = false;

  confirmForm: EmailModel = {
    email: null
  };
  
  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
    private responseService: ResponseService
  ) { }

  ngOnInit() {
    const token =  this.route.snapshot.queryParamMap.get('token');
    const tokenId =  this.route.snapshot.queryParamMap.get('tokenId');

    if((token && token != "") && (tokenId && tokenId  != "")) {
      this.tokenModel = {
        token: token,
        tokenId: tokenId
      };
      this.loading = true;

      this.authService.emailConfirmationEmail(this.tokenModel).then(response => {
        this.loading = false;
        this.messageObject = this.messageService.successMessageObject(successMessages.EMAIL_VERIFIED);
      }, error => {
        this.loading = false;
        this.emailVerificationError = true;
        const message = this.responseService.handleError(error, errorMessages.TOKEN_INVALID);
        this.messageObject = this.messageService.errorMessageObject(message);
      })
    }
  }

  handleEmailConfirmation(form: NgForm) {
    this.loading = true;
    this.authService.resendConfirmationEmail(this.confirmForm).then(response => {
      this.loading = false;
      this.messageObject = this.messageService.successMessageObject(successMessages.CONFIRMATION_EMAIL_SENT);
      form.resetForm();
    }, error => {
      this.loading = false;
      console.log(error);
      const message = this.responseService.handleError(error, errorMessages.CONFIRMATION_EMAIL_FAILURE);
      this.messageObject = this.messageService.errorMessageObject(message);      
    });
  }

  emailConfirmationProcess() {
    this.tokenModel = null;
    this.messageObject = null;
  }
}
