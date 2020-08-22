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
  selector: "app-user-register",
  templateUrl: "./user-register.component.html",
  styles: []
})
export class UserRegisterComponent {
  registerModel: any;

  @Output() close = new EventEmitter()
  @Output() onSave = new EventEmitter();
  
  initialLoading: boolean = false;
  loading: boolean = false;
  messageObject: any;

  @Input() set user(data: any) {
    this.initializeModel(data);  
  }

  get user(): any {
    return this.registerModel;
  }  

  public validationOptions:any = {
    // Rules for form validation
    rules: {
      firstname: {
        required: true
      },
      lastname: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      password: {
        required: true,
        goodPassword: true
      }
    },

    // Messages for form validation
    messages: {
      firstname: {
        required: 'Please enter your first name'
      },
      lastname: {
        required: 'Please enter your last name'
      },
      email: {
        required: 'Please enter your email address',
        email: 'Please enter a VALID email address'
      },
      password: {
        required: 'Please enter password',
      }
    },

    //submitHandler: this.registerUser

  };

  constructor(
    private router: Router,
    private messageService: MessageService,
    private responseService: ResponseService,
    private authService: AuthService,
  ) {
  }

  // ngOnInit() {
  //   this.initializeModel();
  // }

  initializeModel(data: any = null): any {
    if(data) {
      this.registerModel = {
        _id: data._id,
        FirstName: data.FirstName,
        LastName: data.LastName,
        Phone: data.Phone,
        Password: data.Password,
        DateOfBirth: data.DateOfBirth,
        Email: data.Email,
        JobTitle: data.JobTitle
      };
    } else {
      this.registerModel = {
        _id: null,
        FirstName: null,
        LastName: null,
        Phone: null,
        Password: null,
        DateOfBirth: null,
        Email: null,
        JobTitle: null
      };
    }
  }

  registerUser() {
    if(!$("form[name='registerform']").valid()) return false;

    let registerForm = Object.assign({}, this.registerModel);
    registerForm.Password = null;

    Object.keys(registerForm).forEach((key) => (registerForm[key] == null || registerForm[key] == "") && delete registerForm[key]);
    
    this.loading = true;

    this.authService
      .executeStitchFunction("createUser", [registerForm])
      .then(
        response => {
          if (response.success == true) {
            if(registerForm._id && registerForm._id != '') {
              this.loading = false;

              this.messageObject = this.messageService.successMessageObject(
                successMessages.CLARITY_USER_UPDATION_SUCCESS
              );
              this.onSave.emit();
            } else {
              this.registerStitchUser(this.registerModel);
            }
          } else {
            this.loading = false;

            this.messageObject = this.messageService.errorMessageObject(
              response.message
            );
          }
        },
        error => {
          this.loading = false;

          const message = this.responseService.handleError(
            error,
            errorMessages.CLARITY_USER_CREATION_FAILURE
          );
          this.messageObject = this.messageService.errorMessageObject(message);
        }
      );
  }

  registerStitchUser(registerForm) {
    this.authService.register(registerForm).then(
      res => {
        console.log(res);
        this.loading = false;

        this.messageObject = this.messageService.successMessageObject(
          successMessages.CLARITY_USER_CREATION_SUCCESS
        );
        this.onSave.emit();
      },
      error => {
        this.loading = false;

        const message = this.responseService.handleError(
          error,
          errorMessages.CLARITY_USER_CREATION_FAILURE
        );

        this.messageObject = this.messageService.errorMessageObject(
          message
        );
      }
    );
  }
}
