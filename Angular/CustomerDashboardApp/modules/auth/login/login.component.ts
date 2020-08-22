import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from "@angular/router";
import { AuthService, LocalStorageService, MessageService, ResponseService, GlobalFilterService } from '@app/core/services';
import { errorMessages, successMessages } from '@app/config/messages.config';
import { constants } from '@app/config/constants';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  loading: boolean = false;
  redirectUrl: string;

  messageObject: any;

  loginForm: LoginModel = {
    email: null,
    password: null,
    remember: true
  };

  constructor(
    private router: Router, 
    private route: ActivatedRoute,
    private messageService: MessageService,
    private authService: AuthService,
    private responseService: ResponseService,
    private localStorageService: LocalStorageService,
    private globalFilterService: GlobalFilterService
    ) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe(queryParams => {
      this.redirectUrl = queryParams.get("returnUrl");
    })
  }

  loginSubmit() {
    this.loading = true;
    this.authService.login(this.loginForm).then(response => {
      this.authService.executeStitchFunction("getUserDetails", [this.loginForm.email]).then(response => {
        if(response.success == true) {
          const user = response.data;
          if(user.ForceResetPassword) {
            this.authService.sendResetPasswordEmail({email: this.loginForm.email }).then(res =>{
              this.messageObject = this.messageService.infoMessageObject(successMessages.FORCE_RESET_PASSWORD);      
            }, error => {
              this.messageObject = this.messageService.errorMessageObject(errorMessages.FORGOT_PASSWORD_FAILURE);      
            });
          } else {
            if(this.redirectUrl && this.redirectUrl !== "") {
              //this.router.navigateByUrl(this.redirectUrl);
            } else if(user.ClaritySuperAdmin || user.ClarityAdmin) {
              this.redirectUrl = constants.adminUrl;
            } else {
              this.redirectUrl = constants.clientUrl;
            }

            this.localStorageService.storeAuthUser(user, this.loginForm.remember);
            
            // Initialize global filter store again
            this.globalFilterService.setStore();
            
            this.router.navigateByUrl(this.redirectUrl);
          }
        } else {
          this.messageObject = this.messageService.errorMessageObject(response.message);
        }
        this.loading = false;
      }, error => {
        this.loading = false;
        const message = this.responseService.handleError(error, errorMessages.LOGIN_FAILURE);
        this.messageObject = this.messageService.errorMessageObject(message);
      });
    }, error => {
      this.loading = false;
      const message = this.responseService.handleError(error, errorMessages.LOGIN_FAILURE);
      this.messageObject = this.messageService.errorMessageObject(message);         
    });
  }

}
