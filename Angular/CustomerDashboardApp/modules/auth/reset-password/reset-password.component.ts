import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute} from "@angular/router";
import { AuthService } from '@app/core/services/auth.service';
import { NgForm } from '@angular/forms';
import { MessageService, ResponseService } from '@app/core/services';
import { successMessages, errorMessages } from '@app/config/messages.config';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit {
  loading: boolean = false;
  messageObject: any;

  resetForm: any = {
    password: null
  };

  tokenModel: TokenModel;

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

    if((!token || token == "") || (!tokenId || tokenId == "")) {
      this.router.navigateByUrl("/login");
    } else {
      this.tokenModel = {
        token: token,
        tokenId: tokenId
      };
    }
  }

  handleResetPassword(form: NgForm) {
    this.loading = true;
    this.authService.resetPassword(this.resetForm.password, this.tokenModel).then(response => {
      this.loading = false;
      this.messageObject = this.messageService.successMessageObject(successMessages.PASSWORD_RESET_SUCCESS);
      form.resetForm();
      // this.authService.executeStitchFunction("removeForceResetPasswordFromUserDetails").then(result => {
      //   this.loading = false;
      //   this.messageObject = this.messageService.successMessageObject(successMessages.PASSWORD_RESET_SUCCESS);
      //   form.resetForm();
      // }, error => {
      //   this.loading = false;
      //   const message = this.responseService.handleError(error, errorMessages.PASSWORD_RESET_FAILURE);
      //   this.messageObject = this.messageService.errorMessageObject(message);  
      // })
    }, error => {
      this.loading = false;
      const message = this.responseService.handleError(error, errorMessages.PASSWORD_RESET_FAILURE);
      this.messageObject = this.messageService.errorMessageObject(message);     
    });
  }
}
