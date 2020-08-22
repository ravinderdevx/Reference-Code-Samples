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
  selector: "app-client-register",
  templateUrl: "./client-register.component.html",
  styles: []
})
export class ClientRegisterComponent {
  @Output() close = new EventEmitter()
  @Output() onSave = new EventEmitter();
  
  initialLoading: boolean = false;
  loading: boolean = false;
  messageObject: any;

  registerModel: any;
  _services: any = [];
  //_locations: any = [];

  selectedServices: any = [];
  //selectedLocations: any = [];

  @Input() set client(data: any) {
    this.initializeModel(data);  
  }

  get client(): any {
    return this.registerModel;
  }

  @Input() set clarityServices(data: any) {
    this._services = data;
  }

  get clarityServices() {
    return this._services;
  }

  // @Input() set clarityLocations(data: any) {
  //   this._locations = data;
  // }

  // get clarityLocations() {
  //   return this._locations;
  // }


  public validationOptions:any = {
    // Rules for form validation
    rules: {
      companyname: {
        required: true
      },
      contactname: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true
      }
    },

    // Messages for form validation
    messages: {
      firstname: {
        required: 'Please enter company name'
      },
      contactname: {
        required: 'Please enter contact name'
      },
      email: {
        required: 'Please enter your email address',
        email: 'Please enter a VALID email address'
      },
      phone: {
        required: 'Please enter phone number'
      }
    },

    //submitHandler: this.registerclient

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
        CompanyName: data.CompanyName,
        ContactName: data.ContactName,
        Email: data.Email,
        Phone: data.Phone,
        Password: data.Password,
        Active: data.active
      };

      this.selectedServices = data.ServiceIds && data.ServiceIds.length > 0? data.ServiceIds : [];
      //this.selectedLocations = data.LocationIds && data.LocationIds.length > 0? data.LocationIds : [];
    } else {
      this.registerModel = {
        _id: null,
        CompanyName: null,
        ContactName: null,
        Email: null,
        Phone: null,
        Password: null,
        Active: true
      };

      this.selectedServices = [];
      //this.selectedLocations = [];
    }
  }

  registerClient() {
    if(!$("form[name='registerform']").valid()) return false;

    if(this.selectedServices.length == 0) {
      this.messageObject = this.messageService.errorMessageObject(errorMessages.SELECT_SERVICES_FAILURE);
      return false;
    }

    // if(!this.registerModel._id && this.selectedLocations.length == 0) {
    //   this.messageObject = this.messageService.errorMessageObject("Select locations");
    //   return false;
    // }

    let registerForm = Object.assign({}, this.registerModel);

    Object.keys(registerForm).forEach((key) => (registerForm[key] == null || registerForm[key] == "") && delete registerForm[key]);
    
    registerForm.ServiceIds = this.selectedServices;
    //registerForm.LocationIds = this.selectedLocations;
    
    this.loading = true;

    this.authService
      .executeStitchFunction("createCompany", [registerForm])
      .then(
        response => {
          if (response.success == true) {
            if(registerForm._id && registerForm._id != '') {
              this.loading = false;

              this.messageObject = this.messageService.successMessageObject(
                successMessages.CLIENT_UPDATION_SUCCESS
              );
            } else {
              this.messageObject = this.messageService.successMessageObject(
                successMessages.CLIENT_CREATION_SUCCESS
              );
            }
            this.onSave.emit();
          } else {
            this.loading = false;

            this.messageObject = this.messageService.errorMessageObject(
              response.message
            );
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
  

  onCheckboxChange(option, event) {
    if (event.target.checked) {
        this.selectedServices.push(option._id);
    } else {
      const index = this.selectedServices.findIndex(x => x == option._id);

      if(index !== -1)
        this.selectedServices.splice(index, 1);
    }
  }

  // onCheckboxChange(option, type, event) {
  //   if (event.target.checked) {
  //     if (type == 'service')
  //       this.selectedServices.push(option._id);
  //     else
  //       this.selectedLocations.push(option._id);
  //   } else {
  //     if (type == 'location') {
  //       const index = this.selectedLocations.findIndex(x => x == option._id);

  //       if(index !== -1)
  //         this.selectedLocations.splice(index, 1);
  //     } else {
  //       const index = this.selectedServices.findIndex(x => x == option._id);

  //       if(index !== -1)
  //         this.selectedServices.splice(index, 1);
  //     }
  //   }
  // }

  
  checkIfSelected(_id) {
    let index = this.selectedServices.findIndex(x => String(x) == String(_id));
    return index !== -1 ? true: false;
  }
}
